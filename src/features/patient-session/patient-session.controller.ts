import { Router } from 'express';

import { getController } from '../common/controller';
import * as patientSessionService from './patient-session.service';

const patientSessionController = Router();
const patientSessionSummaryController = Router();

patientSessionSummaryController.get(
    '/',
    getController(patientSessionService.getCount),
);

patientSessionController.get('/', getController(patientSessionService.getAll));

patientSessionController.use('/summary', patientSessionSummaryController);

export default patientSessionController;
