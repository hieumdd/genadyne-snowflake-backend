import { Knex } from 'knex';

import { Snowflake } from '../../providers/snowflake';

export type Options = {
    count: number;
    page: number;
    start?: string;
    end?: string;
    patientName?: string;
};

type WithClause = (qb: Knex.QueryBuilder) => Knex.QueryBuilder;

export const PatientRepository = ({
    count,
    page,
    start,
    end,
    patientName,
}: Options) => {
    const daysPerBlock = 30;
    const compliantHours = 60 * 60 * 4;
    const compliantThreshold = 0.7;

    const withBlock: WithClause = (qb) => {
        const _qb = qb
            .select({
                patientId: 'PATIENTID',
                patientName: 'PATIENTNAME',
                therapyDate: 'THERAPYDATE',
                secondsOfUse: 'SECONDSOFUSE',
                block: Snowflake.raw(
                    `floor(datediff('day', "THERAPYDATE", current_timestamp()) / ${daysPerBlock})`,
                ),
            })
            .withSchema('LIVE DATA.RESPIRONICS')
            .from('PATIENTSESSIONS_SRC');

        start && end && _qb.whereBetween('THERAPYDATE', [start, end]);
        patientName && _qb.andWhere('PATIENTNAME', 'ILIKE', `%${patientName}%`);

        return _qb;
    };

    const withCompliant: WithClause = (qb) =>
        qb
            .select({
                patientId: 'patientId',
                patientName: 'patientName',
                blockStart: Snowflake.raw(`"block" * ${daysPerBlock}`),
                blockEnd: Snowflake.raw(`("block" + 1) * ${daysPerBlock}`),
                compliantDays: Snowflake.raw(
                    `count_if("secondsOfUse" > ${compliantHours})`,
                ),
            })
            .from('_block')
            .groupBy(['patientId', 'patientName', 'blockStart', 'blockEnd']);

    return Snowflake.with('_block', withBlock)
        .with('_compliant', withCompliant)
        .select({
            patientId: 'patientId',
            patientName: 'patientName',
            blockRange: Snowflake.raw(
                `concat(cast("blockStart" as string), ' - ', cast("blockEnd" as string))`,
            ),
            isCompliant: Snowflake.raw(
                `IFF("compliantDays" / ${daysPerBlock} > ${compliantThreshold}, TRUE, FALSE)`,
            ),
        })
        .from('_compliant')
        .limit(count)
        .offset(count * page);
};

export default PatientRepository;
