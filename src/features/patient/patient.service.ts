import { Connection } from 'snowflake-sdk';

import { execute } from '../../providers/snowflake';
import patientRepository from './patient.repository';

const patientService = (connection: Connection) =>
    execute(connection, patientRepository().toQuery());

export default patientService;
