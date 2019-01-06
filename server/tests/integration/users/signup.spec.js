import supertest from 'supertest';
import { User } from '../../../database/models';
import app from '../../../index';

describe('User Sign Up Tests', () => {
  test('Should register a new user', async () => {
    await User.destroy({ where: {} });

    const fakeUser = {
      name: 'Alex Dus',
      password: 'password',
      email: 'sd@alexdus.com',
    };

    const { status, body } = await supertest(app)
      .post('/api/v1/users/signup')
      .send(fakeUser);

    expect(status).toBe(200);
    expect(body.data.user.name).toBe(fakeUser.name);
    expect(body.data.user.email).toBe(fakeUser.email);
    expect(body.data.access_token).toBeTruthy();

    const userFromDatabase = await User.find({ where: { email: fakeUser.email } });

    expect(userFromDatabase).toBeTruthy();
  });

  test('Should return validation error for duplicate email', async () => {
    const userData = {
      name: 'Alex Dus',
      password: 'password',
      email: 'sd@alexdus.com',
    };

    await User.destroy({ where: {} });

    await User.create(userData);

    const { body, status } = await supertest(app)
      .post('/api/v1/users/signup')
      .send(userData);

    expect(status).toBe(422);
    expect(body).toMatchSnapshot();
  });
});
