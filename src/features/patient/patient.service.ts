import knex from 'knex';
import { Connection } from 'snowflake-sdk';

import { execute, Snowflake } from '../../providers/snowflake';
import PatientRepository, { Options } from './patient.repository';

class PatientService {
    connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    getAll(options: Options & { count: number; page: number }) {
        const { count, page } = options;

        const query = PatientRepository(options)
            .limit(count)
            .offset(count * page)
            .toQuery();

        return execute(this.connection, query);
    }

    getByCompliant() {
        const query = PatientRepository({})
            .select(['compliant'])
            .count('patientSeqKey', { as: 'count' })
            .groupBy(['compliant'])
            .toQuery();

        return execute(this.connection, query);
    }
}

export default PatientService;
