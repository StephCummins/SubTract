import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL
});

export default {
  query: async (text: string, params: any, callback?: any) => {
    return pool.query(text, params, await callback);
  }
};
