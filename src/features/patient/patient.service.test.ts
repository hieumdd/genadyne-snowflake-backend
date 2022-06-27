import { getConnection } from '../../providers/snowflake';
import PatientService from './patient.service';

import cases from './patient.config.test';
import { Connection } from 'snowflake-sdk';

describe('Query', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await getConnection();
    });

    it.each(cases)('$name', async ({ options }) => {
        const patientService = new PatientService(connection, options);
        return patientService.getAll().then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });

    it('Count', async () => {
        const patientService = new PatientService(connection, cases[1].options);
        return patientService.getCount().then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });

    it('Count By Compliant', async () => {
        const patientService = new PatientService(connection, cases[1].options);
        return patientService.getCountByCompliant().then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });
});
