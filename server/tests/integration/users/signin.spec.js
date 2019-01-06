import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { User } from '../../../database/models';
import app from '../../../index';

describe('User Login Tests', () => {
  test('Should allow user to login and get JWT', async () => {
    await User.destroy({ where: {} });

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
      .post('/api/v1/users/signin')
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(status).toBe(200);
    expect(body.data.access_token).toBeTruthy();
    expect(body.data.user.email).toBe(userData.email);
  });
});
