import { http } from '@google-cloud/functions-framework';
import express from 'express';

import patientController from './patient/patient.controller';

const app = express();
app.use(patientController);

http('main', app);
