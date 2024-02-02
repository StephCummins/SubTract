import express, { Router, Request, Response, NextFunction } from 'express';
import subsController from '../controllers/subsController';
const subsRouter: Router = express.Router();

subsRouter.post(
  '/addsub',
  subsController.addNewSub,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.newSub);
  }
);

export default subsRouter;
