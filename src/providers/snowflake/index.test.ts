import { Connection } from 'snowflake-sdk';
import {
    QueryBuilder,
    connectionPromise,
    disconnect,
    execute,
} from '.';

it('Connect - Disconnect', async () => {
    const connection = await connectionPromise;

    expect(connection.isUp()).toBe(true);

    await disconnect();

    expect(connection.isUp()).toBe(false);
});

describe('Execute', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await connectionPromise;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('Execute', async () => {
        const sql = QueryBuilder.select()
            .withSchema('LIVE DATA.RESPIRONICS')
            .from('PATIENTSESSIONS_SRC')
            .orderBy('PATIENTID')
            .limit(10)
            .offset(500)
            .toQuery();

        return execute(connection, sql).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
});
