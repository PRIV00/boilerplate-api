import { openDatabaseConnection } from './config';

import express, { Application } from 'express';

import userRouter from './routers/userRouter';
import authRouter from './routers/loginRouter';


openDatabaseConnection();

export const app: Application = express();

app.use(express.json());
app.use('/profile', userRouter);
app.use('/login', authRouter);

app.listen(5000, () => console.log('Server running'));
