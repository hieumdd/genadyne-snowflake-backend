import { Request } from 'express';
import { Connection } from 'snowflake-sdk';

import PatientService from '../features/patient/patient.service';

declare module 'express-serve-static-core' {
    interface Request {
        snowflake: Connection;
        patientService: PatientService;
    }
}
