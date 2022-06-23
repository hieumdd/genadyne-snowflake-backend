import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { getConnection } from './providers/snowflake';
import PatientSessionController from './features/patient-session/patient-session.controller';
import PatientController from './features/patient/patient.controller';

const app = express();

app.use(async (req, res, next) => {
    req.snowflake = await getConnection();
    next();
});

app.get('/patient-session', PatientSessionController);
app.get('/patient', PatientController);

http('main', app);
