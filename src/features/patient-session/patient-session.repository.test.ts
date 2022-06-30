import PatientSessionRepository from './patient-session.repository';
import cases from './patient-session.config.test';

describe('Build', () => {
    it.each(cases)('$name', async ({ options }) => {
        const query = PatientSessionRepository(options).select().toQuery();
        console.log({ query });
        expect(query).toBeTruthy();
    });
});
