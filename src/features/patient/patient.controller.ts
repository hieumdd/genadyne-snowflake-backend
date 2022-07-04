import { Router } from 'express';

import { getController } from '../common/controller';
import * as patientService from './patient.service';

const patientController = Router();
const patientSummaryController = Router();

patientController.get('/', getController(patientService.getAll));

patientSummaryController.get('/', getController(patientService.getCount));

patientSummaryController.get(
    '/start-of-month',
    getController(patientService.getCountByStartOfMonth),
);

patientSummaryController.get(
    '/compliant',
    getController(patientService.getCountByCompliant),
);

patientSummaryController.get(
    '/therapy-mode-group',
    getController(patientService.getCountByTherapyModeGroup),
);

patientSummaryController.get(
    '/age',
    getController(patientService.getCountByAge),
);

patientController.use('/summary', patientSummaryController);

export default patientController;
