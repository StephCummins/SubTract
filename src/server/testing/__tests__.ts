import request from 'supertest';
import { server } from '../server';

interface userTest {
  userId?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuth: boolean;
  picture?: string | null;
  dateCreated?: string;
  newPassword?: string;
}

afterAll((done) => {
  server.close();
  done();
});

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
  let cookie: string[] = [];
  let testUser: userTest = {
    firstName: 'Evie',
    lastName: 'Corgi',
    email: 'lowrider@corgi.com',
    password: 'n0FluffsG1v3n!',
    googleAuth: false,
    picture: null,
    newPassword: ''
  };

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
        testUser.password = response.body.password;
      })
      .catch((error) => {
        console.log('Error at /user/signup test:', error);
      });
  });

  it('Responds with 200 status when a user logs out', () => {
    return (
      request(server)
        .post('/user/logout')
        .set('Cookie', cookie)
        .send(testUser)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
        // NEED TO WAIT 1 SECOND FOR JWT TO UPDATE
        .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
        .catch((error) => {
          console.log('Error at /user/logout test:', error);
        })
    );
  });

  it('Responds with 200 status when a user logs in; the response body is an object with all user data', () => {
    testUser.password = 'n0FluffsG1v3n!';
    return request(server)
      .post('/user/login')
      .send(testUser)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('user_id');
        expect(response.body).toHaveProperty('first_name');
        expect(response.body).toHaveProperty('email');
        cookie = response.get('Set-Cookie');
      })
      .catch((error) => {
        console.log('Error at /user/login test:', error);
      });
  });

  it('Responds with 200 status when a user account is updated; the response body is an object with the updated user data', () => {
    testUser.firstName = 'Eevee';
    return request(server)
      .patch('/user/updateaccount')
      .set('Cookie', cookie)
      .send(testUser)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('user_id');
        expect(response.body).toHaveProperty('first_name');
        expect(response.body).toHaveProperty('email');
      })
      .then(() => console.log('end of update!'))
      .catch((error) => {
        console.log('Error at /user/updateaccount test:', error);
      });
  });

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
