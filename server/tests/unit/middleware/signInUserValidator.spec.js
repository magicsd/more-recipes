import middleware from '../../../middleware';
import validators from '../../../validators';

const { signinUserValidator } = middleware;

describe('"SignInUserValidator" Middleware Tests', () => {
  test('Should call "next" if the validation passed successfully', async () => {
    const request = {
      body: {
        name: 'Alex',
        password: 'password',
        email: 'sd@alexdus.com',
      },
    };

    const response = { sendFailureResponse() {} };

    const next = jest.fn();

    await signinUserValidator(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('Should call "sendFailureResponse" if validation failed', async () => {
    const userData = {
      name: 'Alex',
      password: 'pass',
    };

    const validator = new validators.SignInUserValidator(userData);
    validator.isValid();
    const { errors } = validator;

    const request = {
      body: userData,
    };

    const sendFailureResponse = jest.fn();
    const response = { sendFailureResponse };

    const next = jest.fn();

    await signinUserValidator(request, response, next);

    expect(sendFailureResponse).toHaveBeenCalledWith({ errors }, 422);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
