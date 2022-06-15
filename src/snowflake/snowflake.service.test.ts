import { query } from './snowflake.service';

it('query', () =>
    query('SELECT * from "LIVE DATA".RESMED.PATIENTLIST_SRC LIMIT 5').then(
        (data) => expect(data).toBeTruthy(),
    ));
