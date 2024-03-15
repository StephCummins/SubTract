import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import SessionMessage from './SessionMessage';

const BudgetTipsPage = ({ user, subs, setShowMenu }): JSX.Element => {
  const [messages, setMessages] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentSession, setCurrentSession] = useState(false);
  const [userInput, setUserInput] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setShowMenu(true);
  });

  const handleStartChat = (e) => {
    e.preventDefault();
    setCurrentSession(true);
    startSession();
  };

  const startSession = async () => {
    try {
      const response = await fetch('/ai/startchatsession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, subs })
      });

      const data = await response.json();
      setConversationHistory(data.convoHistory);
      setMessages(() => [...messages, data.chatbotMessage]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    askQuestion();
  };

  const askQuestion = async () => {
    try {
      const currentQuestion = userInput;
      console.log(userInput);
      setUserInput('Loading...');

      const response = await fetch('/ai/askquestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationHistory,
          question: currentQuestion
        })
      });

      const data = await response.json();
      setConversationHistory(data.convoHistory);
      setMessages(() => [...messages, currentQuestion, data.chatbotMessage]);
      setUserInput('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Grid item xs={12} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              py: 5,
              px: 5,
              my: 5,
              mx: 5,
              mt: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant="h1"
              color="primary"
              sx={{ textAlign: 'center' }}
              gutterBottom
            >
              Budget Tips
            </Typography>
            <Typography
              component="h2"
              color="#616161"
              fontFamily="poppins"
              fontSize="1.15rem"
              fontWeight="bold"
              sx={{ textAlign: 'center' }}
              gutterBottom
            >
              Need help with budgeting your subscriptions or personal finance
              advice? Start a live chat session for help reaching your financial
              goals.
            </Typography>
            {!currentSession && (
              <Grid
                xs={12}
                md={6}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleStartChat}
                  sx={{
                    mt: 3,
                    mb: 5,
                    py: 2,
                    mx: 2,
                    width: '225px',
                    bgcolor: 'secondary.main',
                    '&:active': {
                      transform: 'translateY(4px)',
                      bgcolor: 'secondary.main'
                    },
                    '&:hover': {
                      bgcolor: 'secondary.dark'
                    }
                  }}
                >
                  Start Live Session
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    mt: 3,
                    mb: 5,
                    py: 2,
                    mx: 2,
                    width: '225px',
                    color: '$primary'
                  }}
                >
                  Return to Dashboard
                </Button>
              </Grid>
            )}
            {currentSession && (
              <Button
                type="button"
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  mt: 3,
                  mb: 5,
                  py: 2,
                  mx: 2,
                  width: '225px',
                  color: '$primary'
                }}
              >
                End Session
              </Button>
            )}
            {messages.length > 0 && (
              <>
                <Box
                  overflow="scroll"
                  sx={{
                    py: 4,
                    px: 4,
                    my: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '2px solid #06BEE1',
                    maxHeight: '400px',
                    alignText: 'start'
                  }}
                >
                  {messages.map((message, index) => {
                    let color = index % 2 === 0 ? '#05299E' : 'black';
                    let role = index % 2 === 0 ? 'assistant' : 'you';
                    return (
                      <SessionMessage
                        role={role}
                        message={message}
                        key={index}
                        color={color}
                      />
                    );
                  })}
                </Box>
                <TextField
                  fullWidth
                  name="userTextField"
                  label="Chat With Your Personal Finance Assistant"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  sx={{ mx: 5 }}
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleAskQuestion}
                  sx={{
                    mt: 3,
                    mb: 5,
                    py: 2,
                    mx: 2,
                    width: '225px',
                    bgcolor: 'secondary.main',
                    '&:active': {
                      transform: 'translateY(4px)',
                      bgcolor: 'secondary.main'
                    },
                    '&:hover': {
                      bgcolor: 'secondary.dark'
                    }
                  }}
                >
                  Chat
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default BudgetTipsPage;
