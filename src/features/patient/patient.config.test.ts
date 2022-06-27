import { Options } from './patient.repository';

const time = { start: '2020-01-01', end: '2023-01-01' };
const patientName = { patientName: 'LAIRD  NANCY' };

const cases: { name: string; options: Options }[] = [
    { name: 'Query', options: {} },
    { name: 'Query w/ Date', options: { ...time } },
    { name: 'Query w/ All', options: { ...time, ...patientName } },
    { name: 'Query w/ Patient Name', options: { ...patientName } },
];

export default cases;
