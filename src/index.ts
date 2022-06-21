import { http } from '@google-cloud/functions-framework';
import express, { NextFunction, Request, Response } from 'express';

import {
    execute,
    connectionPromise,
} from './providers/snowflake/snowflake.repository';
import { build } from './providers/snowflake/snowflake.service';
import PatientSession, {
    PatientSessionQueryOptions,
} from './features/patient-session';

const snowflake = async (req: Request, _: Response, next: NextFunction) => {
    req.snowflake = await connectionPromise;
    next();
};

const app = express();

app.use(snowflake);

app.get('/patient-session', (req: Request, res: Response) => {
    const queryOptions: PatientSessionQueryOptions = {
        count: parseInt(<string>req.query.count || '0'),
        page: parseInt(<string>req.query.page || '500'),
        start: <string>req.query.start,
        end: <string>req.query.end,
    };

    execute(req.snowflake, build(queryOptions, PatientSession))
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

http('main', app);
