import { Handler, Router } from 'express';

import * as PatientService from './patient-session.service';

const patientSessionController = Router();
const patientSessionSummaryController = Router();

const getController =
    (service: PatientService.Service): Handler =>
    (req, res) => {
        service(req.snowflake, req.options)
            .then((data) => res.json({ data }))
            .catch((err) => res.status(500).json({ error: err.message }));
    };

patientSessionController.use((req, res, next) => {
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

patientSessionController.get('/', getController(PatientService.getAll));

patientSessionSummaryController.get('/', getController(PatientService.getCount));

patientSessionSummaryController.get(
    '/start-of-month',
    getController(PatientService.getCountByStartOfMonth),
);

patientSessionSummaryController.get(
    '/compliant',
    getController(PatientService.getCountByCompliant),
);

patientSessionSummaryController.get(
    '/therapy-mode-group',
    getController(PatientService.getCountByTherapyModeGroup),
);

patientSessionSummaryController.get(
    '/age',
    getController(PatientService.getCountByAge),
);

patientSessionController.use('/summary', patientSessionSummaryController);

export default patientSessionController;
