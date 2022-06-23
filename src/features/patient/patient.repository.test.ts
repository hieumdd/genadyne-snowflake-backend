import PatientRepository, { Options } from './patient.repository';

const page = { count: 10, page: 0 };
const time = { start: '2020-01-01', end: '2023-01-01' };
const patientName = { patientName: 'LAIRD  NANCY' };

export const testCases: { name: string; options: Options }[] = [
    { name: 'Query', options: { ...page } },
    { name: 'Query With Date', options: { ...page, ...time } },
    { name: 'Query with All', options: { ...page, ...time, ...patientName } },
    { name: 'Query with Patient Name', options: { ...page, ...patientName } },
];

it.each(testCases)('Query', ({ name, options }) => {
    const query = PatientRepository(options).toQuery();
    console.log({ name, query });
    expect(query).toBeTruthy();
});
