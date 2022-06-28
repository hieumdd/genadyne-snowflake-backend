import { Knex } from 'knex';

import { Snowflake } from '../../providers/snowflake';

export type Options = {
    start?: string;
    end?: string;
    patientName?: string;
    count: number;
    page: number;
};

const PatientRepository = ({ start, end, patientName }: Options) => {
    const dimensions = {
        therapyDate: 'THERAPYDATE',
        patientSeqKey: 'PATIENTSEQKEY',
        patientId: 'PATIENTID',
        patientName: 'PATIENTNAME',
        patientFirstName: 'PATIENTFIRSTNAME',
        patientOfficeName: 'PATIENTOFFICENAME',
        patientDateOfBirth: 'PATIENTDATEOFBIRTH',
        facilityPatientId: 'FACILITYPATIENTID',
        device: 'DEVICE',
        deviceModel: 'DEVICEMODEL',
        pcpupin: 'PCPUPIN',
        sleepdrupin: 'SLEEPDRUPIN',
        therapyMode: 'THERAPYMODE',
        secondsOfUse: 'SECONDSOFUSE',
    };

    const withFlag = (qb: Knex.QueryBuilder) => {
        qb.withSchema('LIVE DATA.RESPIRONICS')
            .from('PATIENTSESSIONS_SRC')
            .select({
                ...dimensions,
                rolling30DaysUsage: Snowflake.raw(
                    `sum(
                        iff("SECONDSOFUSE" > 0, 1, 0)
                    ) over (partition by "PATIENTID" order by "THERAPYDATE")`
                ),
                rolling30Days4hrsUsage: Snowflake.raw(
                    `sum(
                        iff("SECONDSOFUSE" > 60 * 60 * 4, 1, 0)
                    ) over (partition by "PATIENTID" order by "THERAPYDATE")`
                ),
            });
        start && end && qb.whereBetween('THERAPYDATE', [start, end]);
        patientName && qb.andWhere('PATIENTNAME', 'ILIKE', `%${patientName}%`);

        return qb;
    };

    const withPatient = (qb: Knex.QueryBuilder) =>
        qb.from('flag').select({
            ...Object.keys(dimensions)
                .map((dimension) => ({ [dimension]: dimension }))
                .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
            rolling30DaysUsage: 'rolling30DaysUsage',
            rolling30Days4hrsUsage: 'rolling30Days4hrsUsage',
            startOfMonth: Snowflake.raw(
                `date_trunc('month', "therapyDate")`
            ),
            therapyModeGroup: Snowflake.raw(
                `case
                    when
                        "therapyMode" ilike '%ST%'
                        or "therapyMode" ilike '%ASV%'
                        or "therapyMode" ilike '%AVAPS%'
                        or "therapyMode" ilike '%S%'
                        or "therapyMode" ilike '%S/T%'
                    then 'RAD'
                    when
                        "therapyMode" ilike '%CPAP%'
                    then 'CPAP'
                    when
                        "therapyMode" ilike '%Bi-Level%'
                        or "therapyMode" ilike '%BiLevel%'
                        then 'Bi-Level'
                else 'Other' end`,
            ),
            over65: Snowflake.raw(
                `iff(datediff(year, "patientDateOfBirth", current_date()) > 65, true, false)`,
            ),
            compliant: Snowflake.raw(
                `iff(
                    "rolling30DaysUsage" > 30 and div0("rolling30DaysUsage", "rolling30Days4hrsUsage") > 0.7,
                    true,
                    false
                )`,
            ),
        });

    return Snowflake.with('flag', withFlag)
        .with('patient', withPatient)
        .from('patient');
};

export default PatientRepository;
