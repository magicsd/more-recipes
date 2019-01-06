import supertest from 'supertest';
import { Recipe } from '../../../database/models';
import app from '../../../index';
import { generateUser, generateRecipe } from '../../utils/generate';

describe('Update Recipe Tests', () => {
  test('Should update recipe successfully', async () => {
    const { user, token } = await generateUser();

    const fakeRecipe = generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id,
    });

    const updatedRecipe = generateRecipe();

    const { status, body } = await supertest(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        access_token: token,
        ...updatedRecipe,
      });

    expect(status).toBe(200);

    const recipeFromDatabase = await Recipe.findById(recipe.id);

    expect(recipeFromDatabase.title).toBe(updatedRecipe.title);
  });
})
