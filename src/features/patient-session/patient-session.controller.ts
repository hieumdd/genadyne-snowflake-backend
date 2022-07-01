import { Router } from 'express';

import { getController } from '../common/controller';
import * as patientService from './patient-session.service';

const patientSessionController = Router();

patientSessionController.get('/', getController(patientService.getAll));

export default patientSessionController;
