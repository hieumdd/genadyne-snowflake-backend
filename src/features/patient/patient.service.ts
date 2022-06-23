import { Connection } from 'snowflake-sdk';

import { execute } from '../../providers/snowflake';
import PatientRepository, { Options } from './patient.repository';

const PatientService = (connection: Connection, options: Options) => {
    const query = PatientRepository(options).toQuery();

    return execute(connection, query);
};

export default PatientService;
