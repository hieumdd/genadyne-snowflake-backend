import PatientRepository from './patient.repository';
import cases from './patient.config.test';

describe('Build', () => {
    it.each(cases)('$name', async ({ options }) => {
        const query = PatientRepository(options).select().toQuery();
        console.log({ query });
        expect(query).toBeTruthy();
    });
});
