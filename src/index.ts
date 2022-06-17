import { http } from '@google-cloud/functions-framework';
import express, { NextFunction, Request, Response } from 'express';

import { execute, connectionPromise } from './providers/snowflake';
import routes from './routes';

const snowflake = async (req: Request, res: Response, next: NextFunction) => {
    req.snowflake = await connectionPromise;
    next();
};

const app = express();

app.use(snowflake);

app.get('/:route', (req: Request, res: Response) => {
    const route = req.params.route;

    if (!(route in routes)) {
        res.status(404).json({ error: `Route ${route} not found` });
        return;
    }
    execute(req.snowflake, routes[route])
        .then((data) => res.json({ data }))
        .catch((err) => res.status(500).json({ error: err.message }));
});

http('main', app);
