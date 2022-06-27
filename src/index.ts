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

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        next();
    }
});

app.get('/patient-session', PatientSessionController);
app.get('/patient', PatientController);

http('main', app);
