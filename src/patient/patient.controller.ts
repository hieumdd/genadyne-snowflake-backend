import { Router } from 'express';

import * as patientService from './patient.service';

const patientController = Router();

patientController.get('/patient', (req, res) =>
    patientService
        .get()
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message })),
);

export default patientController;
