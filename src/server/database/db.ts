import pg from 'pg';

const PG_URI = process.env.POSTGRESS_URL;

const pool = new pg.Pool({
  connectionString: PG_URI,
});

export default {
  query: (text: string, params: any, callback?: any) => {
    return pool.query(text, params, callback);
  },
};
