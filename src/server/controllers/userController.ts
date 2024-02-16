import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/db';
import type ErrorMessage from '../models/errorInterface';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

interface NewUserController {
  addNewUser(req: Request, res: Response, next: NextFunction): any;
  setCookie(req: Request, res: Response, next: NextFunction): any;
  login(req: Request, res: Response, next: NextFunction): any;
  hashPassword(req: Request, res: Response, next: NextFunction): any;
  authUser(req: Request, res: Response, next: NextFunction): any;
  checkUserAccount(req: Request, res: Response, next: NextFunction): any;
  checkIfLoggedIn(req: Request, res: Response, next: NextFunction): any;
  logout(req: Request, res: Response, next: NextFunction): any;
}

const userController: NewUserController = {
  async addNewUser(req, res, next) {
    try {
      const user = req.body;

      const newUserData = `INSERT INTO users (first_name, last_name, email, password, google_auth, picture) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

      const queryParams = [
        user.firstName,
        user.lastName,
        user.email.toLowerCase(),
        res.locals.password,
        user.googleAuth,
        user.picture
      ];

      const response: any = await db.query(newUserData, queryParams);
      res.locals.newUser = response.rows[0];
      console.log(res.locals.newUser);
      console.log(res.locals.newUser.user_id);
      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.addNewUser',
        message: { error: 'Error adding user to database' }
      };
      return next(message);
    }
  },

  async setCookie(req, res, next) {
    try {
      const id = res.locals.userData
        ? res.locals.userData.user_id
        : res.locals.newUser.user_id;

      const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: process.env.JWT_EXPIRATION
      });

      console.log(token);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true
      });
      console.log('cookie success!');

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.setCookie',
        message: { error: 'Error setting cookie' }
      };
      return next(message);
    }
  },

  async login(req, res, next) {
    try {
      const { email } = req.body;

      const loginData = `SELECT * FROM users WHERE email = $1`;
      const queryParam = [email.toLowerCase()];

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
  },

  async checkUserAccount(req, res, next) {
    try {
      const { email } = req.query;
      console.log('req.params', req.query);

      const userData = `SELECT * FROM users WHERE email = $1`;
      const queryParam = [email];
      const response: any = await db.query(userData, queryParam);
      res.locals.userAccount = response.rows;
      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.checkUserAccount',
        message: { error: 'Error checking if user account exists' }
      };
      return next(message);
    }
  },

  async checkIfLoggedIn(req, res, next) {
    try {
      const { token } = req.cookies;
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload;

      if (payload) {
        const inactiveToken = `SELECT * FROM inactivejwt WHERE tokenname = $1`;
        const queryParamOne = [token];
        const inactive: any = await db.query(inactiveToken, queryParamOne);
        console.log(inactive);
        if (!inactive.rows[0]) {
          const loginData = `SELECT * FROM users WHERE user_id = $1`;
          const queryParam = [payload.id];
          const response: any = await db.query(loginData, queryParam);
          res.locals.userData = response.rows[0];
        } else {
          res.locals.userData = undefined;
        }

        // const loginData = `SELECT * FROM users WHERE user_id = $1`;
        // const queryParam = [payload.id];
        // const response: any = await db.query(loginData, queryParam);
        // res.locals.userData = response.rows[0];
      } else {
        res.locals.userData = undefined;
      }

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.checkIfLoggedIn',
        message: { error: 'Error checking if user is already logged in' }
      };
      return next(message);
    }
  },

  async logout(req, res, next) {
    try {
      console.log('In the logout middleware');
      const { token } = req.cookies;
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload;

      if (payload) {
        const inactiveJWT = `INSERT INTO inactivejwt (tokenname) VALUES($1)`;
        const queryParam = [token];
        await db.query(inactiveJWT, queryParam);
      }

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.logout',
        message: { error: 'Error logging out user' }
      };
      return next(message);
    }
  }
};

export default userController;
