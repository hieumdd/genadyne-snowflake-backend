import { getService } from '../common/service';
import patientSessionRepository from '../patient-session/patient-session.repository';

export const getCountService = (columns?: string[]) =>
    getService((options) => {
        const count = patientSessionRepository(options).countDistinct(
            'PATIENTID',
            {
                as: 'COUNT',
            },
        );

        columns && count.select(columns).groupBy(columns);

        return count;
    });

export const getAll = getService((options) => {
    const { count, page } = options;

    return patientSessionRepository(options)
        .select()
        .orderBy([{ column: 'PATIENTID', order: 'desc' }])
        .limit(count)
        .offset(count * page);
});

export const getCount = getCountService();

export const getCountByStartOfMonth = getCountService(['STARTOFMONTH']);

export const getCountByCompliant = getCountService(['LASTCOMPLIANT']);

export const getCountByTherapyModeGroup = getCountService([
    'LASTTHERAPYMODEGROUP',
]);

export const getCountByAge = getCountService(['LASTOVER65']);
