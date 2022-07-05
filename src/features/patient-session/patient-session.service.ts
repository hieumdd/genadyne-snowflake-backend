import { getService } from '../common/service';
import patientSessionRepository from './patient-session.repository';

export const getAll = getService((options) => {
    const { count, page } = options;

    return patientSessionRepository(options)
        .orderBy([
            { column: 'PATIENTID', order: 'desc' },
            { column: 'THERAPYDATE', order: 'desc' },
        ])
        .limit(count)
        .offset(count * page);
});
