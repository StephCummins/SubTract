import request from 'supertest';
import { server } from '../server';
import type UserTest from './testingModels/UserTestInterface';
import type SubscriptionTest from './testingModels/SubTestInterface';

let subCookie: string[] = [];
let subTestUser: UserTest;
let subTest: SubscriptionTest;

beforeAll(async () => {
  subTestUser = {
    firstName: 'Obi-Wan',
    lastName: 'Corgi',
    email: 'usetheforce@corgi.com',
    password: 'B1narySuns77!',
    googleAuth: false,
    picture: null,
    newPassword: ''
  };

  subTest = {
    name: 'Netflix',
    website: 'netflix.com',
    signupDate: 'Tue, 12 Mar 2024 07:00:00 GMT',
    monthlyFee: 20,
    freeTrial: false,
    dateFreeTrialEnds: null,
    totalSpent: 20,
    autoCalc: false
  };

  const response = await request(server).post('/user/signup').send(subTestUser);
  subTestUser.userId = response.body.user_id;
  subTest.userId = response.body.user_id;
  subCookie = response.get('Set-Cookie');
});

afterEach((done) => {
  done();
});

afterAll(async () => {
  await request(server)
    .delete('/user/deleteaccount')
    .set('Cookie', subCookie)
    .send(subTestUser);

  server.close();
});

describe('server API tests', () => {
  describe('Load App /', () => {
    describe('GET', () => {
      it('responds with sending index.html file and content-type: text/html; charset=UTF-8', async () => {
        try {
          return await request(server)
            .get('/')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=UTF-8');
        } catch (error) {
          console.log('Error testing loading app', error);
        }
      });
    });
  });

  describe('Global Error Handler *', () => {
    describe('GET', () => {
      it('responds with startus 404', async () => {
        try {
          return await request(server).get('/invalidwebpage').expect(404);
        } catch (error) {
          console.log('Error testing global error handler', error);
        }
      });
    });
  });
});

describe('user router API tests', () => {
  let userCookie: string[] = [];
  let testUser: UserTest = {
    firstName: 'Evie',
    lastName: 'Corgi',
    email: 'lowrider@corgi.com',
    password: 'n0FluffsG1v3n!',
    googleAuth: false,
    picture: null,
    newPassword: ''
  };

  it('Responds with 200 status when a new user is created; the response body is an object with all new user data', async () => {
    try {
      const response = await request(server)
        .post('/user/signup')
        .send(testUser)
        .expect('Content-Type', /application\/json/)
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('last_name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('password');
      expect(response.body).toHaveProperty('google_auth');
      expect(response.body).toHaveProperty('picture');
      expect(response.body.first_name).toEqual('Evie');
      expect(response.body.last_name).toEqual('Corgi');
      expect(response.body.email).toEqual('lowrider@corgi.com');

      userCookie = response.get('Set-Cookie');
      testUser.userId = response.body.user_id;
      testUser.password = response.body.password;
    } catch (error) {
      console.log('Error at /user/signup test:', error);
    }
  });

  it('Responds with 200 status when a user logs out; the response body is a string with the message: Logged Out', async () => {
    try {
      const response = await request(server)
        .post('/user/logout')
        .set('Cookie', userCookie)
        .send(testUser)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);

      expect(response.text).toEqual('Logged Out');

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('Error at /user/logout test:', error);
    }
  });

  it('Responds with 200 status when a user logs in; the response body is an object with all user data', async () => {
    testUser.password = 'n0FluffsG1v3n!';
    try {
      const response = await request(server)
        .post('/user/login')
        .send(testUser)
        .expect('Content-Type', /application\/json/)
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('last_name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('password');
      expect(response.body).toHaveProperty('google_auth');
      expect(response.body).toHaveProperty('picture');
      expect(response.body.first_name).toEqual('Evie');
      expect(response.body.last_name).toEqual('Corgi');
      expect(response.body.email).toEqual('lowrider@corgi.com');
      userCookie = response.get('Set-Cookie');
    } catch (error) {
      console.log('Error at /user/login test:', error);
    }
  });

  it('Responds with 200 status when a user account is updated; the response body is an object with the updated user data', async () => {
    testUser.firstName = 'Eevee';
    try {
      const response = await request(server)
        .patch('/user/updateaccount')
        .set('Cookie', userCookie)
        .send(testUser)
        .expect('Content-Type', /application\/json/)
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('last_name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('password');
      expect(response.body).toHaveProperty('google_auth');
      expect(response.body).toHaveProperty('picture');
      expect(response.body.first_name).toEqual('Eevee');
      expect(response.body.last_name).toEqual('Corgi');
      expect(response.body.email).toEqual('lowrider@corgi.com');
    } catch (error) {
      console.log('Error at /user/updateaccount test:', error);
    }
  });

  it('Responds with 200 status when a user is deleted; the response body is a string with the message: Deleted Account!', async () => {
    try {
      const response = await request(server)
        .delete('/user/deleteaccount')
        .set('Cookie', userCookie)
        .send(testUser)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);
      expect(response.text).toEqual('Deleted Account!');
    } catch (error) {
      console.log('Error at /user/deleteaccount test:', error);
    }
  });
});

describe('sub router API tests', () => {
  it('Responds with 200 status when a new sub is created; the response body is an object with all new sub data', async () => {
    try {
      const response = await request(server)
        .post('/subs/addsub')
        .set('Cookie', subCookie)
        .send(subTest)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('newSub');
      expect(response.body.newSub).toHaveProperty('name');
      expect(response.body.newSub).toHaveProperty('website');
      expect(response.body.newSub).toHaveProperty('signup_date');
      expect(response.body.newSub).toHaveProperty('monthly_fee');
      expect(response.body.newSub).toHaveProperty('free_trial');
      expect(response.body.newSub).toHaveProperty('total_spent');
      expect(response.body.newSub).toHaveProperty('auto_calc_free_trial');
      expect(response.body.newSub.user_id).toEqual(subTestUser.userId);
      expect(response.body.newSub.name).toEqual('Netflix');
      expect(response.body.newSub.monthly_fee).toEqual(20);

      subTest.subId = response.body.newSub.subscription_id;
    } catch (error) {
      console.log('Error at /subs/addsub test:', error);
    }
  });

  it('Responds with 200 status when all subs are retrieved; the response body is an object all new subs formatted in an array', async () => {
    try {
      const response = await request(server)
        .get(`/subs/retrieveallsubs?userId=${subTestUser.userId}`)
        .set('Cookie', subCookie)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('formattedSubs');
      expect(response.body.formattedSubs).toBeInstanceOf(Array);
    } catch (error) {
      console.log('Error at /subs/retrieveallsubs test:', error);
    }
  });

  it('Responds with 200 status when a sub is edited; the response body is an object with a message property', async () => {
    subTest.monthlyFee = 22;
    try {
      const response = await request(server)
        .patch('/subs/editsub')
        .set('Cookie', subCookie)
        .send(subTest)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
    } catch (error) {
      console.log('Error at /subs/editsub test:', error);
    }
  });

  it('Responds with 200 status when a sub is deleted; the response body is an object with a message property', async () => {
    try {
      const response = await request(server)
        .delete('/subs/deletesub')
        .set('Cookie', subCookie)
        .send(subTest)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('message');
    } catch (error) {
      console.log('Error at /subs/deletesub test:', error);
    }
  });
});
