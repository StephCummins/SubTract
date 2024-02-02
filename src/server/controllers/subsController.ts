import { Request, Response, NextFunction } from 'express';
import db from '../database/db';

interface NewSubsController {
  addNewSub(req: Request, res: Response, next: NextFunction): void;
}

const subsController: NewSubsController = {
  async addNewSub(req, res, next) {}
};

export default subsController;
