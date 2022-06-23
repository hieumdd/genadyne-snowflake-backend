import { Connection } from 'snowflake-sdk';

import { connection, connect } from '../../providers/snowflake';
import PatientService from './patient.service';

import cases from './patient.config.test';

describe('Query', () => {
    let conn: Connection;

    beforeEach(async () => {
        conn = connection.isUp() ? connection : await connect();
    });

    it.each(cases)('$name', async ({ options }) => {
        return PatientService(conn, options).then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });
});
