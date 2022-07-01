import { Knex } from 'knex';

import { Snowflake } from '../../providers/snowflake';

import { Options } from '../common/repository';

const patientSessionRepository = ({ start, end, patientName }: Options) => {
    const columns = [
        'therapyDate',
        'patientSeqKey',
        'patientId',
        'patientName',
        'patientFirstName',
        'patientOfficeName',
        'patientDateOfBirth',
        'facilityPatientId',
        'device',
        'deviceModel',
        'pcpupin',
        'sleepdrupin',
        'therapyMode',
        'secondsOfUse',
        'startOfMonth',
        'therapyModeGroup',
    ];

    const withCompliant = (qb: Knex.QueryBuilder) => {
        qb.withSchema('UTIL_DB.PUBLIC')
            .from('RESPIRONICS_PATIENTSESSIONS')
            .select([
                ...columns,
                Snowflake.raw(
                    `datediff(year, "patientDateOfBirth", current_date()) > 65 AS "over65"`,
                ),
                Snowflake.raw(
                    `(
                        count_if("usage" > 0) over (
                            partition by "patientId"
                            order by
                                "therapyDate"
                        ) > 30
                        and div0(
                            count_if("usage" > 0) over (
                                partition by "patientId"
                                order by
                                    "therapyDate"
                            ),
                            count_if("usage" > 0) over (
                                partition by "patientId"
                                order by
                                    "therapyDate"
                            )
                        ) > 0.7
                    ) as "compliant"`,
                ),
            ]);

        start && end && qb.whereBetween('therapyDate', [start, end]);
        patientName && qb.andWhere('patientName', 'ILIKE', `%${patientName}%`);

        return qb;
    };

    const withLastCompliant = (qb: Knex.QueryBuilder) =>
        qb
            .from('compliant')
            .select([
                ...columns,
                'over65',
                'compliant',
                Snowflake.raw(
                    `last_value("compliant") over (partition by "patientId" order by "therapyDate") as "lastCompliant"`,
                ),
            ]);

    return Snowflake.with('compliant', withCompliant).with(
        'lastCompliant',
        withLastCompliant,
    );
};

export default patientSessionRepository;
