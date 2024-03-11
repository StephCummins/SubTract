import request from 'supertest';
import server from '../server';

interface userTest {
  userId?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuth: boolean;
  picture?: string | null;
  dateCreated?: string;
}

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

describe('user router API tests', () => {
  describe('/user/', () => {
    let cookie: string[] = [];
    let testUser: userTest = {
      firstName: 'Evie',
      lastName: 'Corgi',
      email: 'lowrider@corgi.com',
      password: 'n0FluffsG1v3n!',
      googleAuth: false,
      picture: null
    };

    describe('POST /signup', () => {
      it('Responds with 200 status when a new user is created; the response body is an object with all new user data', () => {
        return request(server)
          .post('/user/signup')
          .send(testUser)
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty('user_id');
            expect(response.body).toHaveProperty('first_name');
            expect(response.body).toHaveProperty('email');

            cookie = response.get('Set-Cookie');
            testUser.userId = response.body.user_id;
          })
          .catch((error) => {
            console.log('Error at /user/signup test:', error);
          });
      });
    });

    describe('POST /logout', () => {
      it('Responds with 200 status when a user logs out', () => {
        return request(server)
          .post('/user/logout')
          .set('Cookie', cookie)
          .send(testUser)
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
          .catch((error) => {
            console.log('Error at /user/logout test:', error);
          });
      });
    });

    describe('POST /login', () => {
      it('Responds with 200 status when a user logs in; the response body is an object with all user data', () => {
        return (
          request(server)
            .post('/user/login')
            // .set('Cookie', cookie)
            .send(testUser)
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .then((response) => {
              expect(response.body).toBeInstanceOf(Object);
              expect(response.body).toHaveProperty('user_id');
              expect(response.body).toHaveProperty('first_name');
              expect(response.body).toHaveProperty('email');
              cookie = response.get('Set-Cookie');
              //console.log(cookie);
            })
            .catch((error) => {
              console.log('Error at /user/login test:', error);
            })
        );
      });
    });

    describe('DELETE /deleteaccount', () => {
      it('Responds with 200 status when a user is deleted; the response body is a string with the message: Deleted Account!', () => {
        return request(server)
          .delete('/user/deleteaccount')
          .set('Cookie', cookie)
          .send(testUser)
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
          .then((response) => {
            expect(response.text).toEqual('Deleted Account!');
          })
          .catch((error) => {
            console.log('Error at /user/deleteaccount test:', error);
          });
      });
    });
  });
});

// beforeAll(async () => {
//   // const params = [
//   //   'user_id',
//   //   'first_name',
//   //   'last_name',
//   //   'email',
//   //   'password',
//   //   'google_auth',
//   //   'picture',
//   //   'date_created'
//   // ];

//   const params = null;

//   const queryText = `CREATE TABLE 'usertest' (user_id SERIAL PRIMARY KEY,
//     first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL,
//     google_auth BOOLEAN NOT NULL, picture VARCHAR(300), date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;

//   // const queryText = `CREATE TABLE usertest ($1 SERIAL PRIMARY KEY,
//   //                   $2 VARCHAR(50) NOT NULL, $3 VARCHAR(50) NOT NULL,
//   //                   $4 VARCHAR(100) UNIQUE NOT NULL, $5 VARCHAR(100) NOT NULL,
//   //                   $6 BOOLEAN NOT NULL, $7 VARCHAR(300), $8 TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;

//   await db.query(queryText, params);
// });

// // beforeEach(async () => {
// //   const params = [
// //     222,
// //     'Evie',
// //     'Corgi',
// //     'lowrider@corgi.com',
// //     'n0FluffsG1v3n!',
// //     false,
// //     null
// //   ];

// //   const queryText = `INSERT INTO users (first_name, last_name,
// //                      email, password, google_auth, picture)
// //                      VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

// //   await db.query(queryText, params);
// // });

// // afterEach(async () => {
// //   //const param = ['usertest'];
// //   const queryText = `DELETE FROM usertest`;
// //   await db.query(queryText, null);
// // });

// afterAll(async () => {
//   const param = ['usertest'];
//   const queryText = `DROP TABLE 'usertest'`;
//   await db.query(queryText, null);
// });

// // describe('/user/', () => {
// //   describe('POST /signup', () => {
// //     it('Responds with 200 status when a new user is created; the response body is an object with all new user data', () => {
// //       const testUser = {
// //         //userId: 222,
// //         firstName: 'Evie',
// //         lastName: 'Corgi',
// //         email: 'lowrider@corgi.com',
// //         password: 'n0FluffsG1v3n!',
// //         googleAuth: false,
// //         picture: null
// //       };

// //       return request(server)
// //         .post('/user/signup')
// //         .send(testUser)
// //         .expect('Content-Type', /application\/json/)
// //         .expect(200)
// //         .then((response) => {
// //           expect(response.body).toBeInstanceOf(Object);
// //           expect(response.body).toHaveProperty('firstName');
// //           expect(response.body).toHaveProperty('email');
// //         })
// //         .catch((error) => {
// //           console.log('Error at /users/signup test:', error);
// //         });
// //     });
// //   });
// // });
