import { Connection } from 'snowflake-sdk';

import { getConnection } from '../../providers/snowflake';
import patientService from './patient.service';

describe('Query', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await getConnection();
    });

    it('Query', async () => {
        return patientService(connection).then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });
});
