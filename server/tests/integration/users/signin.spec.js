import supertest from 'supertest';
import { generateUser } from '../../utils/generate';
import app from '../../../index';

describe('User Login Tests', () => {
  const SIGNIN_ENDPOINT = '/api/v1/users/signin';

  test('Should allow user to login and get JWT', async () => {
    const { user: { email }, password } = await generateUser();

    const { status, body } = await supertest(app)
      .post(SIGNIN_ENDPOINT)
      .send({ email, password });

    expect(status).toBe(200);
    expect(body.data.access_token).toBeTruthy();
    expect(body.data.user.email).toBe(email);
  });

  test('Should return an error if password is not passed', async () => {
    const user = {
      password: '',
      email: 'sd@alexdus.com',
    };

    const { status, body } = await supertest(app)
      .post(SIGNIN_ENDPOINT)
      .send(user);

    expect(status).toBe(422);
    expect(body.data.errors).toContain('The password is required.');
  });

  test('Should return an error if passed email is not valid', async () => {
    const user = {
      email: 'sd@alexdus',
      password: 'password',
    };

    const { status, body } = await supertest(app)
      .post(SIGNIN_ENDPOINT)
      .send(user);

    expect(status).toBe(422);
    expect(body.data.errors).toContain('The email must be a valid email address.');
  });

  test('Should retun an error if email is not passed', async () => {
    const user = {
      email: '',
      password: 'password',
    };

    const { status, body } = await supertest(app)
      .post(SIGNIN_ENDPOINT)
      .send(user);

    expect(status).toBe(422);
    expect(body.data.errors).toContain('The email is required.');
  });
});
