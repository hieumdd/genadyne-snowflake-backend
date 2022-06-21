import { Connection } from 'snowflake-sdk';

import PatientSession, { PatientSessionQueryOptions } from '.';

import {
    connectionPromise,
    disconnect,
} from '../../providers/snowflake/snowflake.repository';
import { build, query } from '../../providers/snowflake/snowflake.service';

describe('Patient Session', () => {
    let connection: Connection;

    const options: PatientSessionQueryOptions = {
        start: '2022-01-01',
        end: '2022-02-01',
        page: 0,
        count: 10,
    };

    beforeEach(async () => {
        connection = await connectionPromise;
    });

    it('Build', async () => {
        const sql = build(options, PatientSession);
        expect(sql).toBeTruthy()
    });

    it('Query with Date', async () => {
        const options: PatientSessionQueryOptions = {
            start: '2022-01-01',
            end: '2022-02-01',
            page: 0,
            count: 10,
        };
        return query(connection, options, PatientSession).then((data) =>
            expect(data).toBeTruthy(),
        );
    });

    it('Query without Date', async () => {
        const options: PatientSessionQueryOptions = {
            page: 0,
            count: 10,
        };
        return query(connection, options, PatientSession).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
});
