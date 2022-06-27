import { getConnection } from '../../providers/snowflake';
import PatientService from './patient.service';

import cases from './patient.config.test';

describe('Query', () => {
    let patientService: PatientService;

    beforeEach(async () => {
        const connection = await getConnection();
        patientService = new PatientService(connection);
    });

    it.each(cases)('$name', async ({ options }) => {
        return patientService
            .getAll({ ...options, count: 10, page: 0 })
            .then((data) => {
                console.log(data);
                expect(data).toBeTruthy();
            });
    });

    it('By Compliant', () => {
        return patientService.getByCompliant().then((data) => {
            console.log(data);
            expect(data).toBeTruthy();
        });
    });
});
