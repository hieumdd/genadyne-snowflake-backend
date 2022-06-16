import { Router } from 'express';
import { isString } from 'lodash';

import * as service from './snowflake.service';

const router = Router();

router.post('/query', (req, res) => {
    const { query } = req.body;

    isString(query)
        ? service
              .query(query)
              .then((data) => res.json({ data }))
              .catch((err) => res.status(500).json({ error: err.message }))
        : res.status(400).json({ error: 'Bad request' });
});

export default router;
