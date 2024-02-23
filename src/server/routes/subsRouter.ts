import express, { Router, Request, Response, NextFunction } from 'express';
import subsController from '../controllers/subsController';
import userController from '../controllers/userController';
const subsRouter: Router = express.Router();

subsRouter.get(
  '/retrieveallsubs',
  userController.authUserToken,
  subsController.getAllSubs,
  subsController.formatSubs,
  (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .send({
        message: res.locals.message,
        formattedSubs: res.locals.formattedSubs
      });
  }
);

subsRouter.post(
  '/addsub',
  //userController.authUserToken,
  subsController.addNewSub,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.newSub);
  }
);

subsRouter.patch(
  '/editsub',
  //userController.authUserToken,
  subsController.editSub,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('Subscription successfully updated!');
  }
);

subsRouter.delete(
  '/deletesub',
  //userController.authUserToken,
  subsController.deleteSub,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('Subscription deleted');
  }
);

export default subsRouter;
