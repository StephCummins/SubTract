import db from '../database/db';

interface NewUserController {
  addNewUser(req: any, res: any, next: any): void;
}

const userController: NewUserController = {
  async addNewUser(req: any, res: any, next: any) {
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
      return next({
        log: 'Error at userController.addNewUser',
        message: { err: 'Error adding user to database' }
      });
    }
  }
};

export default userController;
