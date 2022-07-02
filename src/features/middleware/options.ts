import { Handler } from 'express';

const optionsMiddleware: Handler = (req, res, next) => {
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
};

export default optionsMiddleware
