import { connect, disconnect, execute } from './snowflake.repository';

export const query = async (sqlText: string) => {
    const connection = await connect();

    return execute(connection, sqlText).finally(() => disconnect(connection));
};
