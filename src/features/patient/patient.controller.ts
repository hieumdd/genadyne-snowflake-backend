import { Router } from 'express';

import patientService from './patient.service';

const patientController = Router();

patientController.get('/', (req, res) => {
    patientService(req.snowflake)
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

export default patientController;
