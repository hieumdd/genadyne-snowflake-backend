import { Knex } from 'knex';

import { Snowflake } from '../../providers/snowflake';

import { Options } from '../common/repository';

const patientSessionRepository = ({ start, end, patientName }: Options) => {
    const columns = [
        'THERAPYDATE',
        'PATIENTSEQKEY',
        'PATIENTID',
        'PATIENTNAME',
        'PATIENTFIRSTNAME',
        'PATIENTOFFICENAME',
        'PATIENTDATEOFBIRTH',
        'FACILITYPATIENTID',
        'DEVICE',
        'DEVICEMODEL',
        'PCPUPIN',
        'SLEEPDRUPIN',
        'AHI',
        'AVERAGELEAK',
        'THERAPYMODE',
        'SECONDSOFUSE',
        'STARTOFMONTH',
        'THERAPYMODEGROUP',
    ];

    const withCompliant = (qb: Knex.QueryBuilder) => {
        qb.withSchema('UTIL_DB.PUBLIC')
            .from('RESPIRONICS_PATIENTSESSIONS')
            .select([
                ...columns,
                Snowflake.raw(
                    `datediff(year, "PATIENTDATEOFBIRTH", current_date()) > 65 AS "OVER65"`,
                ),
                Snowflake.raw(
                    `(
                        count_if("USAGE" > 0) over (
                            partition by "PATIENTID"
                            order by "THERAPYDATE"
                        ) > 30
                        and div0(
                            count_if("USAGE" > 0) over (
                                partition by "PATIENTID"
                                order by "THERAPYDATE"
                            ),
                            count_if("USAGE" > 0) over (
                                partition by "PATIENTID"
                                order by "THERAPYDATE"
                            )
                        ) > 0.7
                    ) as "COMPLIANT"`,
                ),
            ]);

        start && end && qb.whereBetween('THERAPYDATE', [start, end]);
        patientName && qb.andWhere('PATIENTNAME', 'ILIKE', `%${patientName}%`);

        return qb;
    };

    const withLast = (qb: Knex.QueryBuilder) =>
        qb.from('compliant').select([
            ...columns,
            'COMPLIANT',
            Snowflake.raw(
                `last_value("OVER65") ignore nulls over (
                    partition by "PATIENTID"
                    order by "THERAPYDATE"
                ) as "LASTOVER65"`,
            ),
            Snowflake.raw(
                `last_value("COMPLIANT") ignore nulls over (
                    partition by "PATIENTID"
                    order by "THERAPYDATE"
                ) as "LASTCOMPLIANT"`,
            ),
            Snowflake.raw(
                `last_value("THERAPYMODEGROUP") ignore nulls over (
                    partition by "PATIENTID"
                    order by "THERAPYDATE"
                ) as "LASTTHERAPYMODEGROUP"`,
            ),
        ]);

    return Snowflake.with('compliant', withCompliant)
        .with('last', withLast)
        .from('last');
};

export default patientSessionRepository;
