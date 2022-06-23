import { connectionPromise, disconnect } from '../../providers/snowflake';
import PatientRepository, { Options } from './patient.repository';

const page = { count: 10, page: 0 };
const time = { start: '2020-01-01', end: '2023-01-01' };
const patientName = { patientName: 'LAIRD  NANCY' };

export const testCases: [string, Options][] = [
    ['Query', { ...page }],
    ['Query With Date', { ...page, ...time }],
    ['Query with Patient Name', { ...page, ...patientName }],
    ['Query with All', { ...page, ...time, ...patientName }],
];

describe('Patient Repository', () => {
    it('Query', () => {
        const query = PatientRepository(testCases[0][1]);
        console.log(query);
        
    })
    it.each(testCases)('', (_, options) => {
        const query = PatientRepository(options);
        console.log(query);
        expect(query).toBeTruthy();
    });
});
