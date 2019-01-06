import faker from 'faker';
import middleware from '../../../middleware';
import { generateToken, generateUser } from '../../utils/generate';

const { auth } = middleware;

describe('Auth Middleware Tests', () => {
  test('Should call "next" if user is authenticated', async () => {
    const { token } = await generateUser();

    const request = {
      body: {
        access_token: token,
      },
    };

    const response = {};

    const next = jest.fn();

    await auth(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(request.authUser).toBeDefined();
  });

  test('Should run "sendFailureResponse" function if not authenticated', async () => {
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
        access_token: generateToken(faker.internet.email()),
      },
    };

    const sendFailureResponse = jest.fn();

    const response = { sendFailureResponse };

    const next = jest.fn();

    await auth(request, response, next);

    expect(sendFailureResponse).toHaveBeenCalledWith({ message: 'Unauthenticated.' }, 401);
  });
});
