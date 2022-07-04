import { getService } from '../common/service';
import patientRepository from './patient.repository';

export const getCountService = (columns?: string[]) =>
    getService((options) => {
        const count = patientRepository(options).count('patientId', {
            as: 'count',
        });

        columns && count.select(columns).groupBy(columns);

        return count;
    });

export const getAll = getService((options) => {
    const { count, page } = options;

    return patientRepository(options)
        .select()
        .orderBy([{ column: 'patientId', order: 'desc' }])
        .limit(count)
        .offset(count * page);
});

export const getCount = getCountService();

export const getCountByStartOfMonth = getCountService(['startOfMonth']);

export const getCountByCompliant = getCountService(['lastCompliant']);

export const getCountByTherapyModeGroup = getCountService(['therapyModeGroup']);

export const getCountByAge = getCountService(['over65']);
