import express, { Router, Request, Response, NextFunction } from 'express';
import upload from '../multer/multer';
import userController from '../controllers/userController';
const userRouter: Router = express.Router();

userRouter.post(
  '/signup',
  userController.hashPassword,
  userController.addNewUser,
  userController.setToken,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.newUser);
  }
);

userRouter.post(
  '/login',
  userController.login,
  userController.authPassword,
  userController.setToken,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.userData);
  }
);

userRouter.patch(
  '/updateaccount',
  userController.authUserToken,
  userController.updateUserAccount,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.userData);
  }
);

userRouter.post(
  '/uploadavatar',
  upload.single('image'),
  userController.authUserToken,
  userController.uploadAvatar,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.updatedUser);
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

userRouter.delete(
  '/deleteaccount',
  userController.authUserToken,
  userController.deleteAccount,
  userController.logout,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('Deleted Account!');
  }
);

export default userRouter;
