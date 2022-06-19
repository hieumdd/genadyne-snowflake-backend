import { Connection } from 'snowflake-sdk';

declare module 'express-serve-static-core' {
    interface Request {
        snowflake: Connection;
    }
}
