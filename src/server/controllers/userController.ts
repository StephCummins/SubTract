import { Request, Response, NextFunction } from 'express';
import db from '../database/db';
import type ErrorMessage from '../models/errorInterface';

interface NewUserController {
  addNewUser(req: Request, res: Response, next: NextFunction): any;
}

const userController: NewUserController = {
  async addNewUser(req, res, next) {
    try {
      const user = req.body!;
      console.log('Entered User Controller!');
      console.log(req.body);

      const newUserData = `INSERT INTO users (first_name, last_name, email, password, google_auth, picture) VALUES($1, $2, $3, $4, $5, $6)`;

      const queryParams = [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.googleAuth,
        user.picture
      ];

      await db.query(newUserData, queryParams);
      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at userController.addNewUser',
        message: { error: 'Error adding user to database' }
      };
      return next(message);
    }
  }
};

export default userController;
