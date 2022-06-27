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
    };

    const observedDays = 30;
    const compliantSeconds = 60 * 60 * 4;
    const compliantThreshold = 0.7;

    const withFlag = (qb: Knex.QueryBuilder) => {
        qb.withSchema('LIVE DATA.RESPIRONICS')
            .from('PATIENTSESSIONS_SRC')
            .select({
                ...dimensions,
                flag: Snowflake.raw(
                    `iff("SECONDSOFUSE" > ${compliantSeconds} and datediff(day, "THERAPYDATE", current_date()) < ${observedDays}, true, false)`,
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
            therapyModeGroup: Snowflake.raw(
                `case
                    when "therapyMode" ilike '%ST%' OR "therapyMode" ilike '%ASV%' OR "therapyMode" ilike '%AVAPS%'  or "therapyMode" ilike '%S%' or "therapyMode" ilike '%S/T%' then 'RAD'
                    when "therapyMode" ilike '%CPAP%' then 'CPAP'
                    when "therapyMode" ilike '%Bi-Level%' or "therapyMode" ilike '%BiLevel%' then 'Bi-Level'
                else 'Other' end`,
            ),
            over65: Snowflake.raw(
                `iff(datediff(year, "patientDateOfBirth", current_date()) > 65, true, false)`,
            ),
            compliant: Snowflake.raw(
                `iff(count_if("flag" = true) over (partition by "patientId") / ${observedDays} > ${compliantThreshold}, true, false)`,
            ),
        });

    return Snowflake.with('flag', withFlag)
        .with('patient', withPatient)
        .from('patient');
};

export default PatientRepository;
