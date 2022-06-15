import { Connection } from 'snowflake-sdk';
import { connect, disconnect, execute } from './snowflake.repository';

it('connect - disconnect', async () => {
    return connect()
        .then((conn) => {
            expect(conn.isUp()).toBe(true);
            return disconnect(conn);
        })
        .then((conn) => expect(conn.isUp()).toBe(false));
});

describe('repo', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await connect();
    });

    afterEach(async () => {
        await disconnect(connection);
    });

    it('execute', async () => {
        const sql = 'SELECT * from "LIVE DATA".RESMED.PATIENTLIST_SRC LIMIT 5';
        return execute(connection, sql).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
});
