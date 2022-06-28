import { Connection } from 'snowflake-sdk';

import { execute } from '../../providers/snowflake';
import PatientRepository, { Options } from './patient.repository';

class PatientService {
    connection: Connection;
    options: Options;

    constructor(connection: Connection, options: Options) {
        this.connection = connection;
        this.options = options;
    }

    getAll() {
        const { count, page } = this.options;

        const query = PatientRepository(this.options)
            .orderBy([
                { column: 'patientId', order: 'desc' },
                { column: 'therapyDate', order: 'desc' },
            ])
            .limit(count)
            .offset(count * page)
            .toQuery();

        return execute(this.connection, query);
    }

    getCount() {
        const query = PatientRepository(this.options)
            .select(['startOfMonth', 'compliant', 'therapyModeGroup', 'over65'])
            .count('patientSeqKey', { as: 'count' })
            .groupBy([
                'startOfMonth',
                'compliant',
                'therapyModeGroup',
                'over65',
            ])
            .toQuery();

        return execute(this.connection, query);
    }
}

export default PatientService;
