import { Connection } from 'snowflake-sdk';
import { connectionPromise, disconnect, execute } from './snowflake.repository';

it('connect - disconnect', async () => {
    const connection = await connectionPromise;

    expect(connection.isUp()).toBe(true);

    await disconnect();

    expect(connection.isUp()).toBe(false);
});

describe('repo', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await connectionPromise;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('execute', async () => {
        const sql = 'SELECT * from "LIVE DATA".RESPIRONICS.PATIENTSESSIONS_SRC ORDER BY PATIENTID LIMIT 500 OFFSET 500';
        return execute(connection, sql).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
});
