import { Knex } from 'knex';

import { Options } from '../common/repository';
import patientSessionRepository from '../patient-session/patient-session.repository';

const withDistinct = (qb: Knex.QueryBuilder) =>
    qb
        .from('lastCompliant')
        .distinct(
            'patientId',
            'patientName',
            'patientFirstName',
            'patientOfficeName',
            'patientDateOfBirth',
            'facilityPatientId',
            'startOfMonth',
            'lastCompliant',
            'therapyModeGroup',
            'over65',
        );

const patientRepository = (options: Options) =>
    patientSessionRepository(options)
        .with('distinct', withDistinct)
        .from('distinct');

export default patientRepository;
