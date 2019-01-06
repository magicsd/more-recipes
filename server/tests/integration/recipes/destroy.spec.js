import supertest from 'supertest';
import faker from 'faker';
import { Recipe } from '../../../database/models';
import app from '../../../index';
import { generateUser, generateRecipe } from '../../utils/generate';

describe('Delete Recipe Endpoint', () => {
  test('Should delete recipe from database and return a message', async () => {
    const { user, token } = await generateUser();

    const fakeRecipe = generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id,
    });

    const { status, body } = await supertest(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .send({ access_token: token });

    expect(status).toBe(200);
    expect(body.data.message).toBe('Recipe deleted.');

    const recipeFromDatabase = await Recipe.findAll({ where: { id: recipe.id }});

    expect(recipeFromDatabase.length).toBe(0);
  });
});
