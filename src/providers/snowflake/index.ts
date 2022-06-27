import snowflake, { Connection } from 'snowflake-sdk';
import knex from 'knex';

export type Data = {
    [key: string]: any;
};

export const Snowflake = knex({ client: 'pg' });

export const connection = snowflake.createConnection({
    account: 'twa58413.us-east-1',
    username: process.env.SF_USERNAME || '',
    password: process.env.SF_PASSWORD || '',
    authenticator: 'SNOWFLAKE',
});

export const connect = (): Promise<Connection> =>
    new Promise((resolve, reject) => {
        connection.connect((err, conn) => (err ? reject(err) : resolve(conn)));
    });

export const disconnect = (): Promise<Connection> =>
    new Promise((resolve, reject) => {
        connection.destroy((err, conn) => (err ? reject(err) : resolve(conn)));
    });

export const getConnection = () =>
    connection.isUp() ? Promise.resolve(connection) : connect();

type Execute = (connection: Connection, sqlText: string) => Promise<Data[]>;

export const execute: Execute = (connection, sqlText) =>
    new Promise((resolve, reject) => {
        connection.execute({
            sqlText,
            complete: (err, _, rows) =>
                err || !rows ? reject(err) : resolve(rows),
        });
    });
