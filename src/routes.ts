import { Router, Request, Response } from 'express';

import { execute } from './providers/snowflake';

const router = Router();

const route = (sql: string) => (req: Request, res: Response) =>
    execute(req.snowflake, sql)
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));

router.get(
    '/patient',
    route('SELECT * from "LIVE DATA".RESMED.PATIENTLIST_SRC LIMIT 5'),
);

export default router;
