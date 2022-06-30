import { Request } from 'express';
import { Connection } from 'snowflake-sdk';

import { Options } from '../features/patient-session/patient-session.service'

declare module 'express-serve-static-core' {
    interface Request {
        snowflake: Connection;
        options: Options;
    }
}
