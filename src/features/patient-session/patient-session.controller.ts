import { Handler, Request } from 'express';

import PatientSessionService, { Options } from './patient-session.service';

export const parseRequest = (req: Request): Options => ({
    count: parseInt(<string>req.query.count || '500'),
    page: parseInt(<string>req.query.page || '0'),
    start: <string>req.query.start,
    end: <string>req.query.end,
    patientName: decodeURI(<string>req.query.patientName),
});

const PatientSessionController: Handler = async (req, res) => {
    const options = parseRequest(req);

    PatientSessionService(req.snowflake, options)
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
};

export default PatientSessionController;
