import patientSessionRepository from './patient-session.repository';
import cases from '../common/config.test';

describe('Build', () => {
    it.each(cases)('$name', async ({ options }) => {
        const query = patientSessionRepository(options).select().toQuery();
        console.log({ query });
        expect(query).toBeTruthy();
    });
});
