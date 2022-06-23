import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { getConnection } from './providers/snowflake';
import PatientSessionController from './features/patient-session/patient-session.controller';

const app = express();

app.use(async (req, res, next) => {
    req.snowflake = await getConnection();
    next();
});

app.get('/patient-session', PatientSessionController);

http('main', app);
