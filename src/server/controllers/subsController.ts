import { Request, Response, NextFunction } from 'express';
import db from '../database/db';
import ServerErrors from '../models/serverErrors';
import type ErrorMessage from '../models/errorInterface';
import type DatabaseSubscription from '../models/dbSubInterface';

interface NewSubsController {
  getAllSubs(req: Request, res: Response, next: NextFunction): any;
  addNewSub(req: Request, res: Response, next: NextFunction): any;
  editSub(req: Request, res: Response, next: NextFunction): any;
  deleteSub(req: Request, res: Response, next: NextFunction): any;
  formatSubs(req: Request, res: Response, next: NextFunction): any;
}

const subsController: NewSubsController = {
  async getAllSubs(req, res, next) {
    try {
      if (res.locals.message === ServerErrors.NONE) {
        const { userId } = req.query;

        const subsData = `SELECT * FROM subscriptions WHERE user_id = $1`;
        const queryParam = [Number(userId)];

        const response: any = await db.query(subsData, queryParam);
        res.locals.allSubs = response.rows;
      }
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

      const newSubData = `INSERT INTO subscriptions (user_id, name, website, signup_date, monthly_fee, free_trial, date_free_trial_ends, total_spent) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

      const queryParams = [
        sub.userId,
        sub.name,
        sub.website,
        sub.signupDate,
        sub.monthlyFee,
        sub.freeTrial,
        sub.dateFreeTrialEnds,
        sub.totalSpent
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
  },

  async editSub(req, res, next) {
    try {
      const updatedSub = req.body;
      console.log('In the server! editSub controller');
      console.log(updatedSub);

      const updatedSubData = `UPDATE subscriptions SET name = $1, website = $2, signup_date = $3, monthly_fee = $4, free_trial = $5, date_free_trial_ends = $6, total_spent = $7 WHERE subscription_id = $8`;

      const queryParams = [
        updatedSub.name,
        updatedSub.website,
        updatedSub.signupDate,
        updatedSub.monthlyFee,
        updatedSub.freeTrial,
        updatedSub.dateFreeTrialEnds,
        updatedSub.totalSpent,
        updatedSub.subId
      ];

      await db.query(updatedSubData, queryParams);

      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at subsController.editSub',
        message: { error: 'Error updating subscription' }
      };
      return next(message);
    }
  },

  async deleteSub(req, res, next) {
    try {
      const { subId } = req.body;

      const subDelete = `DELETE FROM subscriptions WHERE subscription_id = $1`;
      const queryParams = [subId];
      await db.query(subDelete, queryParams);

      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at subsController.deleteSub',
        message: { error: 'Error deleting subscription' }
      };
      return next(message);
    }
  },

  async formatSubs(req, res, next) {
    try {
      if (res.locals.message === ServerErrors.NONE && res.locals.allSubs[0]) {
        res.locals.formattedSubs = res.locals.allSubs.map(
          (subscription: DatabaseSubscription) => {
            return {
              subId: subscription.subscription_id,
              userId: subscription.user_id,
              name: subscription.name,
              website: subscription.website,
              signupDate: subscription.signup_date,
              monthlyFee: subscription.monthly_fee,
              freeTrial: subscription.free_trial,
              dateFreeTrialEnds: subscription.date_free_trial_ends,
              totalSpent: subscription.total_spent
            };
          }
        );
      }
      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at subsController.formatSub',
        message: { error: 'Error formating subs' }
      };
      return next(message);
    }
  }
};

export default subsController;
