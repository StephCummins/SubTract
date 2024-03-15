import GeneratePrompt from '../openai/generatePrompt';
import type ErrorMessage from '../models/errorInterface';
import dotenv from 'dotenv';
dotenv.config();

const openAIKey = process.env.OPEN_AI_SECRET_KEY;

interface Session {
  messages: Message[];
}

interface Message {
  role: string;
  content: string;
}

const openAIController = {
  async startChat(req, res, next) {
    try {
      const { user, subs } = req.body;
      const session: Session = { messages: [] };
      const prompt = GeneratePrompt(user, subs);
      session.messages.push({ role: 'assistant', content: prompt });
      session.messages.push({
        role: 'user',
        content: `Hello! My name is ${user.firstName} and I'm looking for help with my subscriptions and personal finance advice.`
      });

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: session.messages
          })
        }
      );
      const responseData = await response.json();
      const sanitizedResponse = responseData.choices[0].message.content.trim();
      session.messages.push({ role: 'assistant', content: sanitizedResponse });

      res.locals.chatMessages = {
        message: 'Chat session initialized',
        convoHistory: session.messages,
        chatbotMessage: sanitizedResponse
      };

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at openAIController.startChat',
        message: { error: 'Error starting chat session' }
      };
      return next(message);
    }
  },

  async askQuestion(req, res, next) {
    try {
      const { conversationHistory, question } = req.body;
      conversationHistory.push({ role: 'user', content: question });

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: conversationHistory
          })
        }
      );

      const responseData = await response.json();
      const sanitizedResponse = responseData.choices[0].message.content.trim();

      conversationHistory.push({
        role: 'assistant',
        content: sanitizedResponse
      });

      res.locals.chatMessages = {
        message: 'Chat assistant responded',
        convoHistory: conversationHistory,
        chatbotMessage: sanitizedResponse
      };

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at openAIController.askQuestion',
        message: { error: 'Error during chat session' }
      };
      return next(message);
    }
  }
};

export default openAIController;
