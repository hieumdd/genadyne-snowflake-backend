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

    const withLastCompliant = (qb: Knex.QueryBuilder) =>
        qb
            .from('compliant')
            .select([
                ...columns,
                'COMPLIANT',
                Snowflake.raw(
                    `last_value("OVER65") over (partition by "PATIENTID" order by "THERAPYDATE") as "OVER65"`,
                ),
                Snowflake.raw(
                    `min("COMPLIANT") over (partition by "PATIENTID" order by "THERAPYDATE") as "LASTCOMPLIANT"`,
                ),
            ]);

    return Snowflake.with('compliant', withCompliant).with(
        'lastCompliant',
        withLastCompliant,
    );
};

export default patientSessionRepository;
