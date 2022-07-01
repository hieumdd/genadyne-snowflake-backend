import { getConnection } from '../../providers/snowflake';
import * as PatientService from './patient-session.service';

import cases from './patient-session.config.test';
import { Connection } from 'snowflake-sdk';

describe('Query', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await getConnection();
    });

    it.each(cases)('$name', async ({ options }) => {
        return PatientService.getAll(connection, options).then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });

    it('Count', async () => {
        return PatientService.getCount(connection, cases[1].options).then(
            (data) => {
                console.log(data);
                expect(data).toBeTruthy();
            },
        );
    });
    it('Count by Start of Month', async () => {
        return PatientService.getCountByStartOfMonth(
            connection,
            cases[1].options,
        ).then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });
    it('Count by Compliant', async () => {
        return PatientService.getCountByCompliant(connection, cases[1].options).then(
            (data) => {
                console.log(data);
                expect(data).toBeTruthy();
            },
        );
    });
    it('Count By Therapy Mode Group', async () => {
        return PatientService.getCountByTherapyModeGroup(connection, cases[1].options).then(
            (data) => {
                console.log(data);
                expect(data).toBeTruthy();
            },
        );
    });
    it('Count By Age', async () => {
        return PatientService.getCountByAge(connection, cases[1].options).then(
            (data) => {
                console.log(data);
                expect(data).toBeTruthy();
            },
        );
    });
});
