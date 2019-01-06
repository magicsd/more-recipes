import middleware from '../../../middleware';
import { Recipe } from '../../../database/models';

const { hasRecipe } = middleware;

describe('Middleware "hasRecipe" Function Test', () => {
  test('Should call "next" if there is a recipe', async () => {
    await Recipe.destroy({ where: {} });

    const { dataValues } = await Recipe.create({ title: 'Test Recipe' });

    const request = {
      params: {
        id: dataValues.id,
      },
    };

    const response = {
      sendFailureResponse() {}
    };

    const next = jest.fn();

    await hasRecipe(request, response, next);

    expect(request.currentRecipe).toBeDefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('Should call "sendFailureResponse" if no recipe was found', async () => {
    const request = { params: { id: '123' } };

    const sendFailureResponse = jest.fn();
    const response = { sendFailureResponse };

    const next = jest.fn();

    await hasRecipe(request, response, next);

    expect(sendFailureResponse).toHaveBeenCalledWith({ message: 'Recipe not found.' }, 404);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
