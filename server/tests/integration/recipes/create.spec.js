import supertest from 'supertest';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import app from '../../../index';
import config from '../../../config';
import { User, Recipe } from '../../../database/models';

const { JWT_SECRET } = config;

describe('Create Recipe Test', () => {
  const CREATE_RECIPE_ENDPOINT = '/api/v1/recipes';

  test('Should create recipe and return recipe details', async () => {
    const email = faker.internet.email();
    const user = {
      name: faker.name.findName(),
      password: faker.internet.password(),
      email,
    };

    await User.create({
      name: user.name,
      email: user.email,
      password: bcrypt.hashSync(user.password, 1),
    });

    const token = jwt.sign({ email }, JWT_SECRET);

    const recipeMock = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(2),
      timeToCook: 40,
      imageUrl: faker.internet.url(),
      ingredients: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()]),
      procedure: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()]),
    };

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
