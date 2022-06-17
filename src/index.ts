import { http } from '@google-cloud/functions-framework';
import express, { NextFunction, Request, Response } from 'express';

import { connectionPromise } from './providers/snowflake';
import patientController from './routes';

const snowflake = async (req: Request, res: Response, next: NextFunction) => {
    req.snowflake = await connectionPromise;
    next();
};

const app = express();

app.use(snowflake);
app.use(patientController);

http('main', app);
