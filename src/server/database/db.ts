import pg from 'pg';

const PG_URI = process.env.POSTGRESS_URL;

const pool = new pg.Pool({
  connectionString:
    'postgres://teabipia:O-INMhscwyUtH-zn6z-lj9mo62qcFuAd@kashin.db.elephantsql.com/teabipia',
});

export default {
  query: (text: string, params: any, callback?: any) => {
    console.log('In the Database!');
    return pool.query(text, params, callback);
  },
};
