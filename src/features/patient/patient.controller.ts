import { Handler, Request } from 'express';

import { Options } from './patient.repository';
import PatientSessionService from './patient.service';

const parseRequest = (req: Request): Options => ({
    count: parseInt(<string>req.query.count || '500'),
    page: parseInt(<string>req.query.page || '0'),
    start: <string>req.query.start,
    end: <string>req.query.end,
    patientName: req.query.patientName
        ? decodeURI(<string>req.query.patientName)
        : undefined,
});

const PatientController: Handler = async (req, res) => {
    const options = parseRequest(req);

    PatientSessionService(req.snowflake, options)
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
};

export default PatientController;
