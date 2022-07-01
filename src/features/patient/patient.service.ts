import { getCountService, getService } from '../common/service';
import patientSessionRepository from '../patient-session/patient-session.repository'

const patientCountService = getCountService('patientId')

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

export const getCount = patientCountService();

export const getCountByStartOfMonth = patientCountService(['startOfMonth']);

export const getCountByCompliant = patientCountService(['lastCompliant']);

export const getCountByTherapyModeGroup = patientCountService(['therapyModeGroup']);

export const getCountByAge = patientCountService(['over65']);
