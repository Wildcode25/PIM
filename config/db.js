import pg from 'pg';

//TODO: database connection info should be in environment variables 
export const pool = new pg.Pool({
  user: 'postgres',
  host:process.env.DB_URL,
  database: 'PIM',
  password: 'mordex25',
  port: 5432,
});


