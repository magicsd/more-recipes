import supertest from 'supertest';
import faker from 'faker';
import { Recipe } from '../../../database/models';
import app from '../../../index';
import { generateUser, generateRecipe } from '../../utils/generate';

describe('Get Recipe Endpoint Test', () => {
  test('Should get a recipe by id', async () => {
    const fakeRecipe = generateRecipe();

    const recipe = await Recipe.create(fakeRecipe);

    const { status, body } = await supertest(app)
      .get(`/api/v1/recipes/${recipe.id}`);

    expect(status).toBe(200);
    expect(body.data.recipe.id).toBe(recipe.id);
  });

  test('Should retun 404 if recipe is not found', async () => {
    const FAKE_ID = 'fake_id';

    const { status } = await supertest(app)
      .get(`/api/v1/recipes/${FAKE_ID}`);

    expect(status).toBe(404);
  });
});
