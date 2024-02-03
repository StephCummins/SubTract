import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db';
import type ErrorMessage from '../models/errorInterface';

interface NewUserController {
  addNewUser(req: Request, res: Response, next: NextFunction): any;
  login(req: Request, res: Response, next: NextFunction): any;
  hashPassword(req: Request, res: Response, next: NextFunction): any;
  authUser(req: Request, res: Response, next: NextFunction): any;
}

const userController: NewUserController = {
  async addNewUser(req, res, next) {
    try {
      const user = req.body;
      console.log('Entered User Controller!');
      console.log(req.body);
      console.log(res.locals.password);

      const newUserData = `INSERT INTO users (first_name, last_name, email, password, google_auth, picture) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

      const queryParams = [
        user.firstName,
        user.lastName,
        user.email,
        res.locals.password,
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
      const { email } = req.body;

      const loginData = `SELECT * FROM users WHERE email = $1`;
      const queryParam = [email];

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
  },

  hashPassword(req, res, next) {
    try {
      const { password } = req.body;
      const saltRounds = 10;

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw new Error('bcrypt hashing error');
        else {
          res.locals.password = hash;
          return next();
        }
      });
    } catch (error) {
      console.log(error);
      const message: ErrorMessage = {
        log: 'Error at userController.hashPassword',
        message: { error: 'Error hashing user password' }
      };
      return next(message);
    }
  },

  async authUser(req, res, next) {
    try {
      const { password } = req.body;

      const result = await bcrypt.compare(
        password,
        res.locals.userData.password
      );
      if (!result) throw new Error('Invalid login credentials!');
      else return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.authUser',
        message: { error: 'Error authenticating user' }
      };
      return next(message);
    }
  }
};

export default userController;
