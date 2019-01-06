import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { User } from '../../../database/models';
import app from '../../../index';

describe('User Login Tests', () => {
  const SIGNIN_ENDPOINT = '/api/v1/users/signin';

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  test('Should allow user to login and get JWT', async () => {
    const userData = {
      name: 'Alex Dus',
      password: 'password',
      email: 'sd@alexdus.com',
    };

    await User.create({
      name: userData.name,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 1),
    });

    const { status, body } = await supertest(app)
      .post(SIGNIN_ENDPOINT)
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(status).toBe(200);
    expect(body.data.access_token).toBeTruthy();
    expect(body.data.user.email).toBe(userData.email);
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
