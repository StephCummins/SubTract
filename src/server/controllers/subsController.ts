import { Request, Response, NextFunction } from 'express';
import db from '../database/db';
import type ErrorMessage from '../models/errorInterface';

interface NewSubsController {
  getAllSubs(req: Request, res: Response, next: NextFunction): any;
  addNewSub(req: Request, res: Response, next: NextFunction): any;
}

const subsController: NewSubsController = {
  async getAllSubs(req, res, next) {
    try {
      const { userId } = req.query;

      const subsData = `SELECT * FROM subscriptions WHERE user_id = $1`;
      const queryParam = [Number(userId)];

      const response: any = await db.query(subsData, queryParam);
      res.locals.allSubs = response.rows;
      console.log(res.locals.allSubs);

      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at subsController.getAllSubs',
        message: { error: 'Error retrieving all subscriptions' }
      };
      return next(message);
    }
  },

  async addNewSub(req, res, next) {
    try {
      const sub = req.body;
      console.log('Entered Subs Controller!');
      console.log(req.body);

      const newSubData = `INSERT INTO subscriptions (user_id, name, website, signup_date, monthly_fee, free_trial, date_free_trial_ends) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

      const queryParams = [
        sub.userId,
        sub.name,
        sub.website,
        sub.signupDate,
        sub.monthlyFee,
        sub.freeTrial,
        sub.dateFreeTrialEnds
      ];

      const response: any = await db.query(newSubData, queryParams);
      res.locals.newSub = response.rows[0];
      console.log(res.locals.newSub);
      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at subsController.addNewSub',
        message: { error: 'Error adding new subscription' }
      };
      return next(message);
    }
  }
};

export default subsController;
