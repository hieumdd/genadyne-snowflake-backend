import { Knex } from 'knex';
import { Connection } from 'snowflake-sdk';

import { execute, Data } from '../../providers/snowflake';
import { Options } from './repository';
import patientSessionRepository from '../patient-session/patient-session.repository';

export type Service = (conn: Connection, options: Options) => Promise<Data[]>;

export const getService =
    (queryFn: (options: Options) => Knex.QueryBuilder): Service =>
    (conn, options) =>
        execute(conn, queryFn(options).toQuery());

export const getCountService = (id: string) => (columns?: string[]) =>
    getService((options) => {
        const count = patientSessionRepository(options)
            .count(id, {
                as: 'count',
            })

        columns && count.select(columns).groupBy(columns);

        return count;
    });
