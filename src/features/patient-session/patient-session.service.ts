import { getService } from '../common/service';
import patientSessionRepository from './patient-session.repository';

export const getCountService = (columns?: string[]) =>
    getService((options) => {
        const count = patientSessionRepository(options)
            .from('patient')
            .count('patientSeqKey', { as: 'count' });

        columns && count.select(columns).groupBy(columns);

        return count;
    });

export const getAll = getService((options) => {
    const { count, page } = options;

    return patientSessionRepository(options)
        .orderBy([
            { column: 'patientId', order: 'desc' },
            { column: 'therapyDate', order: 'desc' },
        ])
        .limit(count)
        .offset(count * page);
});

export const getCount = getCountService();

export const getCountByStartOfMonth = getCountService(['startOfMonth']);

export const getCountByCompliant = getCountService(['compliant']);

export const getCountByTherapyModeGroup = getCountService(['therapyModeGroup']);

export const getCountByAge = getCountService(['over65']);
