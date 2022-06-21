import {
    TableQueryOptions,
    TimeQueryOptions,
    TableSchema,
} from '../../providers/snowflake/snowflake.service';

export type PatientSessionQueryOptions = TableQueryOptions & TimeQueryOptions;

export default {
    tableName: '"LIVE DATA".RESPIRONICS.PATIENTSESSIONS_SRC',
    sortField: 'PATIENTID',
    dateField: 'RESPIRONICSFILEDATE',
} as TableSchema;
