import { Knex } from 'knex';
import { Connection } from 'snowflake-sdk';

import { execute, Data } from '../../providers/snowflake';

import { Options } from './repository';

export type Service = (conn: Connection, options: Options) => Promise<Data[]>;

export const getService =
    (queryFn: (options: Options) => Knex.QueryBuilder): Service =>
    (conn, options) =>
        execute(conn, queryFn(options).toQuery());
