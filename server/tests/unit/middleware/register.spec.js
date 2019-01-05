import middleware from '../../../middleware';

const { registerUserValidator } = middleware;

describe('Register User Validator Middleware', () => {
  test('Should call "next" function if validation successful', async () => {
    const request = {
      body: {
        name: 'Alex Dus',
        password: 'password',
        email: 'sd@alexdus.com',
      }
    };

    const response = {
      sendFailureResponse() {},
    };

    const next = jest.fn();

    await registerUserValidator(request, response, next);

    expect(next).toHaveBeenCalled();
  });

  test('Should call "sendFailureResponse" function if validation fails', async () => {
    const request = {
      body: {
        name: 'Alex',
        email: 'sd@alexdus.com',
        password: 'password',
      },
    };

    const sendFailureResponse = jest.fn();

    const response = { sendFailureResponse };

    const next = () => {};

    await registerUserValidator(request, response, next);

    expect(sendFailureResponse).toHaveBeenCalled();
  });
});
