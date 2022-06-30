import { Router } from 'express';

import patientService from './patient.service';

import { getController } from '../common/controller';

const patientController = Router();

patientController.get('/', getController(patientService));

export default patientController;
