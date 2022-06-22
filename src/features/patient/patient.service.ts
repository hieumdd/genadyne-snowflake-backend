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
    { count, page, start, end }: Options,
) => {    
    const sql = QueryBuilder.with('_block', (qb) =>
        qb
            .select({
                patientId: 'PATIENTID',
                patientName: 'PATIENTNAME',
                therapyDate: 'THERAPYDATE',
                secondsOfUse: 'SECONDSOFUSE',
                block: QueryBuilder.raw(
                    `floor(datediff('day', "THERAPYDATE", current_timestamp()) / 30)`,
                ),
            })
            .withSchema('LIVE DATA.RESPIRONICS')
            .from('PATIENTSESSIONS_SRC')
            .where('PATIENTID', 15027457),
    )
        .with('_compliant', (qb) =>
            qb
                .select({
                    patientId: 'patientId',
                    patientName: 'patientName',
                    blockStart: QueryBuilder.raw(`"block" * 30`),
                    blockEnd: QueryBuilder.raw(`("block" + 1) * 30`),
                    compliantDays: QueryBuilder.raw(
                        `count_if("secondsOfUse" > 60 * 60 * 4)`,
                    ),
                })
                .from('_block')
                .groupBy([
                    'patientId',
                    'patientName',
                    'blockStart',
                    'blockEnd',
                ]),
        )
        .select({
            patientId: 'patientId',
            patientName: 'patientName',
            blockRange: QueryBuilder.raw(
                `concat(cast("blockStart" as string), ' - ', cast("blockEnd" as string))`,
            ),
            isCompliant: QueryBuilder.raw(
                `IFF("compliantDays" / 30 > 0.7, TRUE, FALSE)`,
            ),
        })
        .from('_compliant')
        .orderBy(['patientId', 'blockStart']);
};

export default PatientSessionService;
