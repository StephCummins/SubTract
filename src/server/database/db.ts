import pg from 'pg';

const PG_URI =
  'postgres://teabipia:O-INMhscwyUtH-zn6z-lj9mo62qcFuAd@kashin.db.elephantsql.com/teabipia';

const pool = new pg.Pool({
  connectionString: PG_URI,
});

export default {
  query: (text: string, params: any, callback?: any) => {
    return pool.query(text, params, callback);
  },
};
