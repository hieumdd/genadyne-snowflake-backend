import { Connection } from 'snowflake-sdk';

import { getConnection } from '../../providers/snowflake';
import PatientService from './patient.service';

import cases from './patient.config.test';

describe('Query', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await getConnection();
    });

    it.each(cases)('$name', async ({ options }) => {
        return PatientService(connection, options).then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });
});
