import pg from 'pg';
export const pool = new pg.Pool({
  user: 'postgres',
  host:process.env.DB_URL,
  database: 'PIM',
  password: 'mordex25',
  port: process.env.DB_PORT
});


