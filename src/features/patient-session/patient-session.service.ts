import { Connection } from 'snowflake-sdk';

import { QueryBuilder, execute } from '../../providers/snowflake';

export type Options = {
    count: number;
    page: number;
    start?: string;
    end?: string;
    patientName?: string;
};

const PatientSessionService = (
    connection: Connection,
    { count, page, start, end, patientName }: Options,
) => {
    const sql = QueryBuilder.select()
        .withSchema('LIVE DATA.RESPIRONICS')
        .from('PATIENTSESSIONS_SRC');

    start && end && sql.whereBetween('THERAPYDATE', [start, end]);
    patientName && sql.andWhere('PATIENTNAME', 'LIKE', `%${patientName}%`);

    sql.orderBy('PATIENTID')
        .limit(count)
        .offset(count * page);
        
    return execute(connection, sql.toQuery());
};

export default PatientSessionService;
