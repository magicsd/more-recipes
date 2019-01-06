import jwt from 'jsonwebtoken';
import middleware from '../../../middleware';
import { User } from '../../../database/models';
import config from '../../../config';

const { auth } = middleware;
const { JWT_SECRET } = config;

describe('Auth Middleware Tests', () => {
  test('Should call "next" if user is authenticated', async () => {
    await User.destroy({ where: {} });

    const { email } = await User.create({
      name: 'Alex Dus',
      email: 'sd@alexdus.com',
      password: 'password',
    });

    const request = {
      body: {
        access_token: jwt.sign({ email }, JWT_SECRET),
      },
    };

    const response = {};

    const next = jest.fn();

    await auth(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(request.authUser).toBeDefined();
  });

  test('Should run "sendFailureResponse" function if not authenticated', async () => {
    await User.destroy({ where: {} });

    const { email } = await User.create({
      name: 'Alex',
      password: '123',
      email: 'sd@alexdus',
    });

    const request = {
      body: {},
      query: {},
      headers: [],
    };

    const sendFailureResponse = jest.fn();

    const response = { sendFailureResponse };

    const next = jest.fn();

    await auth(request, response, next);

    expect(sendFailureResponse).toHaveBeenCalledWith({ message: 'Unauthenticated.' }, 401);
  })

  test('Should throw an error if the user is not found', async () => {
    const request = {
      body: {
        access_token: jwt.sign({ email: 'dd@alexdus.com'}, JWT_SECRET),
      },
    };

    const sendFailureResponse = jest.fn();

    const response = { sendFailureResponse };

    const next = jest.fn();

    await auth(request, response, next);

    expect(sendFailureResponse).toHaveBeenCalledWith({ message: 'Unauthenticated.' }, 401);
  });
});
