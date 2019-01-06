import middleware from '../../../middleware';

const { authorize } = middleware;

describe('Authorize Middleware Tests', () => {
  test('Should call "next" if authorized', async () => {
    const testId = '123';

    const request = {
      currentRecipe: {
        userId: testId,
      },
      authUser: {
        id: testId,
      }
    };

    const response = { sendFailureResponse() {} };

    const next = jest.fn();

    await authorize(request, response, next);

    expect(next).toHaveBeenCalled();
  });

  test('Should call "sendFailureResponse" if unauthorised', async () => {
    const request = {
      currentRecipe: {
        userId: '123',
      },
      authUser: {
        id: "321",
      },
    };

    const sendFailureResponse = jest.fn();
    const response = { sendFailureResponse };

    const next = jest.fn();

    await authorize(request, response, next);

    expect(sendFailureResponse).toHaveBeenCalledWith({ message: 'Unauthorized.' }, 401);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
