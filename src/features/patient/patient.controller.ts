import { Router } from 'express';

import PatientService from './patient.service';

const patientController = Router();

patientController.use((req, res, next) => {
    const options = {
        count: parseInt(<string>req.query.count || '500'),
        page: parseInt(<string>req.query.page || '0'),
        start: <string>req.query.start,
        end: <string>req.query.end,
        patientName: req.query.patientName
            ? decodeURI(<string>req.query.patientName)
            : undefined,
    };

    req.patientService = new PatientService(req.snowflake, options);

    next();
});

patientController.get('/', async (req, res) => {
    req.patientService
        .getAll()
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

patientController.get('/summary', async (req, res) => {
    req.patientService
        .getCount()
        .then((data) => res.json({ data: data.pop() }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

export default patientController;
