import express from 'express';
import userController from '../controllers/userController';
const userRouter = express.Router();

userRouter.post('/signup', userController.addNewUser, (req, res, next) => {
  return res.status(200).send('New User Added To Database!');
});

export default userRouter;
