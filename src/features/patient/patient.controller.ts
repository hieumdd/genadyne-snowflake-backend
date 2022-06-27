import { Router } from 'express';

import PatientService from './patient.service';

const patientController = Router();

patientController.use((req, res, next) => {
    req.patientService = new PatientService(req.snowflake);
    next();
});

patientController.get('/', async (req, res) => {
    const options = {
        count: parseInt(<string>req.query.count || '500'),
        page: parseInt(<string>req.query.page || '0'),
        start: <string>req.query.start,
        end: <string>req.query.end,
        patientName: req.query.patientName
            ? decodeURI(<string>req.query.patientName)
            : undefined,
    };

    req.patientService
        .getAll(options)
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

patientController.get('/by-compliant', async (req, res) => {
    req.patientService
        .getByCompliant()
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

export default patientController;
