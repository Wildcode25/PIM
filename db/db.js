import pg from 'pg';


export const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PIM',
  password: 'mordex25',
  port: 5432,
});


