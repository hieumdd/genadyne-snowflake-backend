import { Connection } from 'snowflake-sdk';

import { execute } from '../../providers/snowflake';
import PatientRepository from './patient.repository';

export type Options = {
    count: number;
    page: number;
    start?: string;
    end?: string;
    patientName?: string;
};

const PatientService = (connection: Connection, options: Options) => {
    const query = PatientRepository(options)
        .orderBy(['patientId', 'blockStart'])
        .toQuery();

    return execute(connection, query);
};

export default PatientService;
