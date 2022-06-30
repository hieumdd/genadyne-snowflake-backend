import { Request } from 'express';
import { Connection } from 'snowflake-sdk';

import { Options } from '../features/pati../features/patient-session/patient.service

declare module 'express-serve-static-core' {
    interface Request {
        snowflake: Connection;
        options: Options;
    }
}
