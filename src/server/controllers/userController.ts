import { Request, Response, NextFunction } from 'express';
import db from '../database/db';
import type ErrorMessage from '../models/errorInterface';

interface NewUserController {
  addNewUser(req: Request, res: Response, next: NextFunction): any;
  login(req: Request, res: Response, next: NextFunction): any;
}

const userController: NewUserController = {
  async addNewUser(req, res, next) {
    try {
      const user = req.body!;
      console.log('Entered User Controller!');
      console.log(req.body);

      const newUserData = `INSERT INTO users (first_name, last_name, email, password, google_auth, picture) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

      const queryParams = [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.googleAuth,
        user.picture
      ];

      const response: any = await db.query(newUserData, queryParams);
      res.locals.newUser = response.rows[0];
      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at userController.addNewUser',
        message: { error: 'Error adding user to database' }
      };
      return next(message);
    }
  },

  async login(req, res, next) {
    try {
      const { password } = req.body;

      const loginData = `SELECT * FROM users WHERE password = $1`;
      const queryParam = [password];

      const response: any = await db.query(loginData, queryParam);
      res.locals.userData = response.rows[0];
      return next();
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at userController.login',
        message: { error: 'Error logging in' }
      };
      return next(message);
    }
  }
};

export default userController;
