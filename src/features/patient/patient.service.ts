import { getService } from '../common/service';
import patientRepository from './patient.repository';

const patientService = getService((options) => {
    const { count, page } = options;

    return patientRepository()
        .limit(count)
        .offset(count * page);
});

export default patientService;
