import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { connection, connect } from './providers/snowflake';
import PatientSessionController from './features/patient-session/patient-session.controller';

const app = express();

app.use(async (req, res, next) => {
    req.snowflake = connection.isUp() ? connection : await connect();
    next();
});

app.get('/patient-session', PatientSessionController);

http('main', app);
