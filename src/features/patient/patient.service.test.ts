import { getConnection } from '../../providers/snowflake';
import * as patientService from './patient.service';

import cases from '../common/config.test';
import { Connection } from 'snowflake-sdk';

describe('Query', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await getConnection();
    });

    it.each(cases)('$name', async ({ options }) => {
        return patientService.getAll(connection, options).then((data) => {
            expect(data).toBeTruthy();
        });
    });

    it('Count', async () => {
        return patientService
            .getCount(connection, cases[1].options)
            .then((data) => expect(data).toBeTruthy());
    });

    it('Count by Start of Month', async () => {
        return patientService
            .getCountByStartOfMonth(connection, cases[1].options)
            .then((data) => expect(data).toBeTruthy());
    });
    it('Count by Compliant', async () => {
        return patientService
            .getCountByCompliant(connection, cases[1].options)
            .then((data) => {
                expect(data).toBeTruthy();
            });
    });
    it('Count By Therapy Mode Group', async () => {
        return patientService
            .getCountByTherapyModeGroup(connection, cases[1].options)
            .then((data) => expect(data).toBeTruthy());
    });
    it('Count By Age', async () => {
        return patientService
            .getCountByAge(connection, cases[1].options)
            .then((data) => expect(data).toBeTruthy());
    });
});
