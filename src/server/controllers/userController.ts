import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/db';
import FileTransfer from '../aws/s3';
import ServerErrors from '../models/ServerErrors';
import type JwtPayload from '../models/JwtPayloadInterface';
import type ErrorMessage from '../models/errorInterface';
import dotenv from 'dotenv';
dotenv.config();

interface NewUserController {
  addNewUser(req: Request, res: Response, next: NextFunction): any;
  setToken(req: Request, res: Response, next: NextFunction): any;
  authUserToken(req: Request, res: Response, next: NextFunction): any;
  login(req: Request, res: Response, next: NextFunction): any;
  hashPassword(req: Request, res: Response, next: NextFunction): any;
  authPassword(req: Request, res: Response, next: NextFunction): any;
  updateUserAccount(req: Request, res: Response, next: NextFunction): any;
  uploadAvatar(req: Request, res: Response, next: NextFunction): any;
  loadTempAvatar(req: Request, res: Response, next: NextFunction): any;
  checkUserAccount(req: Request, res: Response, next: NextFunction): any;
  checkIfLoggedIn(req: Request, res: Response, next: NextFunction): any;
  logout(req: Request, res: Response, next: NextFunction): any;
  deleteAccount(req: Request, res: Response, next: NextFunction): any;
}

const userController: NewUserController = {
  async addNewUser(req, res, next) {
    try {
      const user = req.body;

      const newUserData = `INSERT INTO users (first_name, last_name, 
                           email, password, google_auth, picture) 
                           VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

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
      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.addNewUser',
        message: { error: 'Error adding user to database' }
      };
      return next(message);
    }
  },

  async setToken(req, res, next) {
    try {
      const id = res.locals.userData
        ? res.locals.userData.user_id
        : res.locals.newUser.user_id;

      const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: process.env.JWT_EXPIRATION
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true
      });

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.setCookie',
        message: { error: 'Error setting cookie' }
      };
      return next(message);
    }
  },

  async authUserToken(req, res, next) {
    try {
      const { token } = req.cookies;

      res.locals.message = token
        ? ServerErrors.NONE
        : ServerErrors.USER_NOT_AUTHENTICATED;

      if (token) {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY!
        ) as JwtPayload;

        if (!payload) res.locals.message = ServerErrors.USER_NOT_AUTHENTICATED;
        else {
          const checkForInactiveToken = `SELECT * FROM inactivejwt WHERE tokenname = $1`;
          const queryParamOne = [token];
          const inactive: any = await db.query(
            checkForInactiveToken,
            queryParamOne
          );
          if (inactive.rows[0]) {
            res.locals.message = ServerErrors.USER_NOT_AUTHENTICATED;
          }
        }
      }

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.authUserToken',
        message: { error: 'Error authenticating user token' }
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
      const message: ErrorMessage = {
        log: 'Error at userController.login',
        message: { error: 'Error logging in' }
      };
      return next(message);
    }
  },

  hashPassword(req, res, next) {
    try {
      let { password } = req.body;
      const saltRounds = 10;

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw new Error('bcrypt hashing error');
        else {
          res.locals.password = hash;
          return next();
        }
      });
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.hashPassword',
        message: { error: 'Error hashing user password' }
      };
      return next(message);
    }
  },

  async authPassword(req, res, next) {
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

  async updateUserAccount(req, res, next) {
    try {
      const user = req.body;
      res.locals.password = user.password;

      if (req.body.newPassword !== '') {
        user.password = req.body.newPassword;

        const saltRounds = 10;

        bcrypt.hash(user.password, saltRounds, (err, hash) => {
          if (err) throw new Error('bcrypt hashing error');
          else {
            res.locals.password = hash;
            return next();
          }
        });
      }

      const updatedUserData = `UPDATE users SET first_name = $1, last_name = $2, 
                               email = $3, password = $4 WHERE user_id = $5 RETURNING *`;

      const queryParams = [
        user.firstName,
        user.lastName,
        user.email,
        res.locals.password,
        user.userId
      ];

      const response: any = await db.query(updatedUserData, queryParams);
      res.locals.userData = response.rows[0];
      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.updateUserAccount',
        message: { error: 'Error updating user account' }
      };
      return next(message);
    }
  },

  async uploadAvatar(req, res, next) {
    if (req.body.error) return res.status(400).redirect('/error');
    const file = req.file;
    const { userId } = req.body;

    try {
      const result = await FileTransfer.uploadFile(file);
      const imageLocation = result.Location;

      const updatedImageData = `UPDATE users SET picture = $1 
                                WHERE user_id = $2 RETURNING *`;

      const queryParams = [imageLocation, userId];

      const response: any = await db.query(updatedImageData, queryParams);

      res.locals.updatedUser = response.rows[0];

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.uploadAvatar',
        message: { error: 'Error updating user avatar' }
      };
      return next(message);
    }
  },

  async loadTempAvatar(req, res, next) {
    try {
      const key = req.query.key;
      const readStream = FileTransfer.getFile(key);
      console.log(readStream);
      readStream.pipe(res);

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.loadAvatar',
        message: { error: 'Error loading user avatar' }
      };
      return next(message);
    }
  },

  async checkUserAccount(req, res, next) {
    try {
      const { email } = req.query;
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

      if (token) {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY!
        ) as JwtPayload;

        if (payload) {
          const inactiveToken = `SELECT * FROM inactivejwt WHERE tokenname = $1`;
          const queryParamOne = [token];
          const inactive: any = await db.query(inactiveToken, queryParamOne);

          if (!inactive.rows[0]) {
            const loginData = `SELECT * FROM users WHERE user_id = $1`;
            const queryParam = [payload.id];
            const response: any = await db.query(loginData, queryParam);
            res.locals.userData = response.rows[0];
          } else {
            res.locals.userData = undefined;
          }
        } else {
          res.locals.userData = undefined;
        }
      } else res.locals.userData = undefined;

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
      const { token } = req.cookies;
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload;

      if (payload) {
        const inactiveJWT = `INSERT INTO inactivejwt (tokenname) VALUES($1)`;
        const queryParam = [token];
        await db.query(inactiveJWT, queryParam);
        res.clearCookie('token');
      }

      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.logout',
        message: { error: 'Error logging out user' }
      };
      return next(message);
    }
  },

  async deleteAccount(req, res, next) {
    try {
      if (res.locals.message === ServerErrors.NONE) {
        const { userId } = req.body;

        const deleteAccount = `DELETE FROM users WHERE user_id = $1`;
        const queryParams = [userId];

        await db.query(deleteAccount, queryParams);
      }
      return next();
    } catch (error) {
      const message: ErrorMessage = {
        log: 'Error at userController.deleteAccount',
        message: { error: 'Error deleting user account' }
      };
      return next(message);
    }
  }
};

export default userController;
