import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL
});

export default {
  query: (text: string, params: any, callback?: any) => {
    console.log('In the Database!');
    return pool.query(text, params, callback);
  }
};
