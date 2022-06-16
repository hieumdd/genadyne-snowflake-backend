import {
    connection as conn,
    connectionPromise,
    execute,
} from './snowflake.repository';

export const query = async (sqlText: string) => {
    // debug

    console.log({ isUp: conn.isUp() });
    const connection = await connectionPromise;
    console.log({ isUp: conn.isUp() });

    return execute(connection, sqlText);
};
