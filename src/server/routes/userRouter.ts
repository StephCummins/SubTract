import express, { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
const userRouter: Router = express.Router();

userRouter.post(
  '/signup',
  userController.hashPassword,
  userController.addNewUser,
  userController.setCookie,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.newUser);
  }
);

userRouter.post(
  '/login',
  userController.login,
  userController.authUser,
  userController.setCookie,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.userData);
  }
);

userRouter.get(
  '/checkforaccount',
  userController.checkUserAccount,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.userAccount);
  }
);

userRouter.get(
  '/checkifloggedin',
  userController.checkIfLoggedIn,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.userData);
  }
);

userRouter.post(
  '/logout',
  userController.logout,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('Logged Out');
  }
);

export default userRouter;
