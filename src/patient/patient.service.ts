import { getRepository } from '../provider/snowflake';

export const get = () => {
    const patientRepository = getRepository();

    return patientRepository(
        'SELECT * from "LIVE DATA".RESMED.PATIENTLIST_SRC LIMIT 5',
    );
};
