import express, { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
const userRouter: Router = express.Router();

userRouter.post(
  '/signup',
  userController.addNewUser,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('New User Added To Database!');
  }
);

export default userRouter;
