import { Pool } from 'pg';

export default new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'csm',
    password: 'qwerty',
    port: 5432
});