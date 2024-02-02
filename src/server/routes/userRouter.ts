import express, { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
const userRouter: Router = express.Router();

userRouter.post(
  '/signup',
  userController.hashPassword,
  userController.addNewUser,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.newUser);
  }
);

userRouter.post(
  '/login',
  userController.login,
  userController.authUser,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.userData);
  }
);

export default userRouter;
