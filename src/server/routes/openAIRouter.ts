import express, { Router, Request, Response, NextFunction } from 'express';
import openAIController from '../controllers/openAIController';
import userController from '../controllers/userController';
const openAIRouter: Router = express.Router();

openAIRouter.post(
  '/startchatsession',
  userController.authUserToken,
  openAIController.startChat,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.chatMessages);
  }
);

openAIRouter.post(
  '/askquestion',
  userController.authUserToken,
  openAIController.askQuestion,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.chatMessages);
  }
);

export default openAIRouter;
