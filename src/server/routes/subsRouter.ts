import express, { Router, Request, Response, NextFunction } from 'express';
import subsController from '../controllers/subsController';
const subsRouter: Router = express.Router();

subsRouter.get(
  '/retrieveallsubs',
  subsController.getAllSubs,
  subsController.formatSubs,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.formattedSubs);
  }
);

subsRouter.post(
  '/addsub',
  subsController.addNewSub,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.newSub);
  }
);

subsRouter.patch(
  '/editsub',
  subsController.editSub,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('Subscription successfully updated!');
  }
);

subsRouter.delete(
  '/deletesub',
  subsController.deleteSub,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send('Subscription deleted');
  }
);

export default subsRouter;
