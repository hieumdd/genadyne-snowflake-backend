import { getCountService, getService } from '../common/service';
import patientSessionRepository from './patient-session.repository';

const patientSessionCountService = getCountService('patientSeqKey')

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

export const getCount = patientSessionCountService();

export const getCountByStartOfMonth = patientSessionCountService(['startOfMonth']);

export const getCountByCompliant = patientSessionCountService(['compliant']);

export const getCountByTherapyModeGroup = patientSessionCountService(['therapyModeGroup']);

export const getCountByAge = patientSessionCountService(['over65']);
