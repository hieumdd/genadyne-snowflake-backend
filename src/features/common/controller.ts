import { Handler } from 'express';

import { Service } from './service';

export const getController =
    (service: Service): Handler =>
    (req, res) => {
        service(req.snowflake, req.options)
            .then((data) => res.json({ data }))
            .catch((err) => res.status(500).json({ error: err.message }));
    };
