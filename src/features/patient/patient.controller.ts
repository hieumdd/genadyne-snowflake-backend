import { Handler, Router } from 'express';

import * as PatientService from './patient.service';

const patientController = Router();
const patientSummaryController = Router();

const getController =
    (service: PatientService.Service): Handler =>
    (req, res) => {
        service(req.snowflake, req.options)
            .then((data) => res.json({ data }))
            .catch((err) => res.status(500).json({ error: err.message }));
    };

patientController.use((req, res, next) => {
    req.options = {
        count: parseInt(<string>req.query.count || '500'),
        page: parseInt(<string>req.query.page || '0'),
        start: <string>req.query.start,
        end: <string>req.query.end,
        patientName: req.query.patientName
            ? decodeURI(<string>req.query.patientName)
            : undefined,
    };

    next();
});

patientController.get('/', getController(PatientService.getAll));

patientSummaryController.get('/', getController(PatientService.getCount));

patientSummaryController.get(
    '/start-of-month',
    getController(PatientService.getCountByStartOfMonth),
);

patientSummaryController.get(
    '/compliant',
    getController(PatientService.getCountByCompliant),
);

patientSummaryController.get(
    '/therapy-mode-group',
    getController(PatientService.getCountByTherapyModeGroup),
);

patientSummaryController.get(
    '/age',
    getController(PatientService.getCountByAge),
);

patientController.use('/summary', patientSummaryController);

export default patientController;
