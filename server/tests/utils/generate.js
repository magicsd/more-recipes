import faker from 'faker';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../database/models';
import config from '../../config';

const { JWT_SECRET } = config;

export const generateToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET);
};

export const generateUser = async () => {
  const password = faker.internet.password();

  const fakeUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(password, 1),
  };

  const user = await User.create(fakeUser);

  const token = generateToken(user.email);

  return { user, password, token };
}

export const generateRecipe = () => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.sentences(2),
  timeToCook: 40,
  imageUrl: faker.internet.url(),
  ingredients: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()]),
  procedure: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()]),
});
