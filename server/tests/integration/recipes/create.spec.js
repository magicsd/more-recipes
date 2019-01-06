import supertest from 'supertest';
import { Recipe } from '../../../database/models';
import app from '../../../index';
import { generateUser, generateRecipe } from '../../utils/generate';

describe('Create Recipe Test', () => {
  const CREATE_RECIPE_ENDPOINT = '/api/v1/recipes';

  test('Should create recipe and return recipe details', async () => {
    const { user, token } = await generateUser();

    const recipeMock = generateRecipe();

    const { status, body } = await supertest(app)
      .post(CREATE_RECIPE_ENDPOINT)
      .send({
        ...recipeMock,
        access_token: token,
      });

    const { recipe } = body.data;

    expect(status).toBe(201);
    expect(recipe.title).toBe(recipeMock.title);
    expect(recipe.description).toBe(recipeMock.description);

    const recipeFromDatabase = await Recipe.findById(recipe.id);

    expect(recipeFromDatabase).toBeTruthy();
  });
});
