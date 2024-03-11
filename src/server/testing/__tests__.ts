import request from 'supertest';
import { jest } from '@jest/globals';
import server from '../server';
import db from '../database/db';

describe('server API tests', () => {
  describe('Load App /', () => {
    describe('GET', () => {
      it('responds with sending index.html file and content-type: text/html; charset=UTF-8', () => {
        return request(server)
          .get('/')
          .expect(200)
          .expect('Content-Type', 'text/html; charset=UTF-8')
          .catch((error) => {
            console.log('Error testing loading app', error);
          });
      });
    });
  });

  describe('Global Error Handler *', () => {
    describe('GET', () => {
      it('responds with startus 404', () => {
        return request(server)
          .get('/invalidwebpage')
          .expect(404)
          .catch((error) => {
            console.log('Error testing global error handler', error);
          });
      });
    });
  });
});

// beforeAll(async () => {
//   const params = [
//     'user_id',
//     'first_name',
//     'last_name',
//     'email',
//     'password',
//     'google_auth',
//     'picture',
//     'date_created'
//   ];

//   const queryText = `CREATE TABLE usertest ($1 SERIAL PRIMARY KEY,
//                     $2 VARCHAR(50) NOT NULL, $3 VARCHAR(50) NOT NULL,
//                     $4 VARCHAR(100) UNIQUE NOT NULL, $5 VARCHAR(100) NOT NULL,
//                     $6 BOOLEAN NOT NULL, $7 VARCHAR(300), $8 TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;

//   await db.query(queryText, params);
// });

// beforeEach(async () => {
//   const params = [
//     222,
//     'Evie',
//     'Corgi',
//     'lowrider@corgi.com',
//     'n0FluffsG1v3n!',
//     false,
//     null
//   ];

//   const queryText = `INSERT INTO users (first_name, last_name,
//                      email, password, google_auth, picture)
//                      VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

//   await db.query(queryText, params);
// });

// afterEach(async () => {
//   const param = ['usertest'];
//   const queryText = `DELETE FROM $1`;
//   await db.query(queryText, param);
// });

// afterAll(async () => {
//   const param = ['usertest'];
//   const queryText = `DROP TABLE $1`;
//   await db.query(queryText, param);
// });

// describe('/user/', () => {
//   describe('POST /signup', () => {
//     it('Responds with 200 status when a new user is created; the response body is an object with all new user data', () => {
//       const testUser = {
//         //userId: 222,
//         firstName: 'Evie',
//         lastName: 'Corgi',
//         email: 'lowrider@corgi.com',
//         password: 'n0FluffsG1v3n!',
//         googleAuth: false,
//         picture: null
//       };

//       return request(server)
//         .post('/user/signup')
//         .send(testUser)
//         .expect('Content-Type', /application\/json/)
//         .expect(200)
//         .then((response) => {
//           expect(response.body).toBeInstanceOf(Object);
//           expect(response.body).toHaveProperty('firstName');
//           expect(response.body).toHaveProperty('email');
//         })
//         .catch((error) => {
//           console.log('Error at /users/signup test:', error);
//         });
//     });
//   });
// });
