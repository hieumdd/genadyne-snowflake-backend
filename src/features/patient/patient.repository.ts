import { Knex } from 'knex';

import { Options } from '../common/repository';
import patientSessionRepository from '../patient-session/patient-session.repository';

const withDistinct = (qb: Knex.QueryBuilder) =>
    qb
        .from('lastCompliant')
        .distinct(
            'PATIENTID',
            'PATIENTNAME',
            'PATIENTFIRSTNAME',
            'PATIENTOFFICENAME',
            'PATIENTDATEOFBIRTH',
            'FACILITYPATIENTID',
            'STARTOFMONTH',
            'LASTCOMPLIANT',
            'THERAPYMODEGROUP',
            'OVER65',
        );

const patientRepository = (options: Options) =>
    patientSessionRepository(options)
        .with('distinct', withDistinct)
        .from('distinct');

export default patientRepository;
