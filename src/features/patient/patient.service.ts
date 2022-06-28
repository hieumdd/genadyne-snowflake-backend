import { Knex } from 'knex';
import { Connection } from 'snowflake-sdk';

import { execute, Data } from '../../providers/snowflake';
import PatientRepository, { Options } from './patient.repository';

export type Service = (conn: Connection, options: Options) => Promise<Data[]>;

const getService =
    (queryFn: (options: Options) => Knex.QueryBuilder): Service =>
    (conn, options) =>
        execute(conn, queryFn(options).toQuery());

const getCountService = (columns?: string[]) =>
    getService((options) => {
        const count = PatientRepository(options).count('patientSeqKey', {
            as: 'count',
        });

        columns && count.select(columns).groupBy(columns);

        return count;
    });

const getCountQueryFn = (columns?: string[]) => (options: Options) => {
    const count = PatientRepository(options).count('patientSeqKey', {
        as: 'count',
    });

    columns && count.select(columns).groupBy(columns);

    return count;
};

export const getAll = getService((options) => {
    const { count, page } = options;

    return PatientRepository(options)
        .orderBy([
            { column: 'patientId', order: 'desc' },
            { column: 'therapyDate', order: 'desc' },
        ])
        .limit(count)
        .offset(count * page);
});

export const getCount = getService(getCountQueryFn());

export const getCountByStartOfMonth = getCountService(['startOfMonth']);

export const getCountByCompliant = getCountService(['compliant']);

export const getCountByTherapyModeGroup = getCountService(['therapyModeGroup']);

export const getCountByAge = getCountService(['over65']);
