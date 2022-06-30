import { Router } from 'express';

import { getController } from '../common/controller';
import * as patientService from './patient-session.service';

const patientSessionController = Router();
const patientSessionSummaryController = Router();

patientSessionController.get('/', getController(patientService.getAll));

patientSessionSummaryController.get('/', getController(patientService.getCount));

patientSessionSummaryController.get(
    '/start-of-month',
    getController(patientService.getCountByStartOfMonth),
);

patientSessionSummaryController.get(
    '/compliant',
    getController(patientService.getCountByCompliant),
);

patientSessionSummaryController.get(
    '/therapy-mode-group',
    getController(patientService.getCountByTherapyModeGroup),
);

patientSessionSummaryController.get(
    '/age',
    getController(patientService.getCountByAge),
);

patientSessionController.use('/summary', patientSessionSummaryController);

export default patientSessionController;
