import { Connection } from 'snowflake-sdk';

import { execute } from './snowflake.repository';

export type TableSchema = {
    tableName: string;
    sortField: string;
    dateField: string;
};

export type TableQueryOptions = {
    count: number;
    page: number;
};

export type TimeQueryOptions = {
    start?: string;
    end?: string;
};

export type QueryRequest = TableQueryOptions &
    TimeQueryOptions & {
        [key: string]: any;
    };

export const build = <T extends QueryRequest>(
    { start, end, count, page, filterClause }: T,
    { tableName, sortField, dateField }: TableSchema,
) => {
    const fromClause = `SELECT * FROM ${tableName}`;
    const whereClause = 'WHERE 1=1';
    const timeFilterClause =
        start && end ? `AND ${dateField} BETWEEN '${start}' AND '${end}'` : '';
    const sortClause = `ORDER BY ${sortField}`;
    const paginationClause = `LIMIT ${count} OFFSET ${page * count}`;

    return [
        fromClause,
        whereClause,
        timeFilterClause,
        filterClause,
        sortClause,
        paginationClause,
    ].join(' ');
};

export const query = (
    connection: Connection,
    queryRequest: QueryRequest,
    tableOptions: TableSchema,
) => execute(connection, build(queryRequest, tableOptions));
