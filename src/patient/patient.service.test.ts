import { get } from './patient.service';

it('get', () => get().then((data) => expect(data).toBeTruthy()));
