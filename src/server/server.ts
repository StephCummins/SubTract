import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import userRouter from './routes/userRouter';

const PORT = 3000;

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../public')));

app.use('/user', userRouter);

app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send('index.html');
  } catch (error) {
    next(error);
  }
});

app.use('*', (req: Request, res: Response) => res.sendStatus(404));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const defaultError = {
    log: 'Express server caught unknown middleware error',
    status: 500,
    message: { err: 'An error occured' },
  };
  const errorObj = Object.assign(defaultError, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
