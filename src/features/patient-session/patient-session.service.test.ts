import { Connection } from 'snowflake-sdk';

import PatientSessionService, { Options } from './patient-session.service';

import { connect, disconnect } from '../../providers/snowflake';

describe('Patient Session', () => {
    let connection: Connection;

    const page = { count: 10, page: 0 };
    const time = { start: '2020-01-01', end: '2023-01-01' };
    const patientName = { patientName: 'LAIRD  NANCY' };

    beforeEach(async () => {
        connection = await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    it('Query', async () => {
        const options: Options = { ...page };
        return PatientSessionService(connection, options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });

    it('Query w/ Date', async () => {
        const options: Options = { ...page, ...time };
        return PatientSessionService(connection, options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });

    it('Query w/ Patient Name', async () => {
        const options: Options = { ...page, ...patientName };
        return PatientSessionService(connection, options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });

    it('Query w/ Date & Patient Name', async () => {
        const options: Options = { ...page, ...time, ...patientName };
        return PatientSessionService(connection, options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
});
