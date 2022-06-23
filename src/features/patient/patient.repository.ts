import { Knex } from 'knex';

import { Snowflake } from '../../providers/snowflake';

export type Options = {
    count: number;
    page: number;
    start?: string;
    end?: string;
    patientName?: string;
};

export const PatientRepository = ({
    count,
    page,
    start,
    end,
    patientName,
}: Options) => {
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

    return Snowflake.with('flag', withFlag)
        .from('flag')
        .select({
            ...Object.keys(dimensions)
                .map((dimension) => ({ [dimension]: dimension }))
                .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
            compliant: Snowflake.raw(
                `iff(count_if("flag" = true) over (partition by "patientId") / ${observedDays} > ${compliantThreshold}, true, false)`,
            ),
        })
        .orderBy([
            { column: 'patientId', order: 'desc' },
            { column: 'therapyDate', order: 'desc' },
        ])
        .limit(count)
        .offset(count * page);
};

export default PatientRepository;
