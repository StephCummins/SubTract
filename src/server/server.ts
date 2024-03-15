import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import openAIRouter from './routes/openAIRouter';
import subsRouter from './routes/subsRouter';
import userRouter from './routes/userRouter';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: `http://localhost:${PORT}`
  })
);

app.use(express.static(path.join(__dirname, '../../public')));

app.use('/user', userRouter);
app.use('/subs', subsRouter);
app.use('/ai', openAIRouter);

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
    message: { err: 'An error occured' }
  };
  const errorObj = Object.assign(defaultError, err);
  return res.status(errorObj.status).json(errorObj.message);
});

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });

// export default app;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

export { app, server };

// module.exports = app;
// module.exports = server;
