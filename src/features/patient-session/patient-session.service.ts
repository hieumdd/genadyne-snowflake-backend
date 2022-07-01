import { getService } from '../common/service';
import patientSessionRepository from './patient-session.repository';

export const getAll = getService((options) => {
    const { count, page } = options;

    return patientSessionRepository(options)
        .from('lastCompliant')
        .orderBy([
            { column: 'patientId', order: 'desc' },
            { column: 'therapyDate', order: 'desc' },
        ])
        .limit(count)
        .offset(count * page);
});
