import { getConnection } from '../../providers/snowflake';
import * as patientSessionService from './patient-session.service';

import cases from '../common/config.test';
import { Connection } from 'snowflake-sdk';

describe('Query', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await getConnection();
    });

    it.each(cases)('$name', async ({ options }) => {
        return patientSessionService
            .getAll(connection, options)
            .then((data) => {
                expect(data).toBeTruthy();
            });
    });

    it('Count', async () => {
        return patientSessionService
            .getCount(connection, cases[1].options)
            .then((data) => {
                expect(data).toBeTruthy();
            });
    });
});
