import { Snowflake } from '../../providers/snowflake';

const patientRepository = () => {
    const dimensions = {
        patientSeqKey: 'PATIENTSEQKEY',
        patientId: 'PATIENTID',
        patientName: 'PATIENTNAME',
        patientFirstName: 'PATIENTFIRSTNAME',
        patientOfficeName: 'PATIENTOFFICENAME',
        patientDateOfBirth: 'PATIENTDATEOFBIRTH',
        facilityPatientId: 'FACILITYPATIENTID',
    };

    return Snowflake.withSchema('LIVE DATA.RESPIRONICS')
        .from('PATIENTSESSIONS_SRC')
        .select(dimensions)
        .distinct();
};

export default patientRepository;
