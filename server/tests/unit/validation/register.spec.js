import faker from 'faker';
import validators from '../../../validators';
import { User } from '../../../database/models';

const { RegisterUserValidator } = validators;

describe('RegisterUserValidator class', () => {
  describe('Validate Name Test', () => {
    test('Adds an error to the errors array if name is not provided', () => {
      const validator = new RegisterUserValidator({
        email: 'sd@alexdus.com',
      });

      validator.validateName();

      expect(validator.errors).toContain('The name is required.');
    });

    test('Adds an error to the errors array if name is less than 5 characters', () => {
      const validator = new RegisterUserValidator({
        name: 'Alex',
      });

      validator.validateName();

      expect(validator.errors).toContain('The name must be longer than 5 characters.');
    });
  });

  describe('Validate Password Test', () => {
    test('Adds an error to the errors array if no password provided', () => {
      const validator = new RegisterUserValidator({
        name: 'Alex',
      });

      validator.validatePassword();

      expect(validator.errors).toContain('The password is required.');
    });

    test('Adds an error to the errors array if password is shorter than 6 chars', () => {
      const validator = new RegisterUserValidator({
        password: '12345',
      });

      validator.validatePassword();

      expect(validator.errors).toContain('The password must be longer than 5 characters.');
    });
  });

  describe('Validate Email Test', () => {
    test('Should add an error to the errors array if no email provided ', async () => {
      const validator = new RegisterUserValidator({ email: '' });

      await validator.validateEmail();

      expect(validator.errors).toContain('The email is required.');
    });

    test('Should add an error to the errors array if invalid email provided', async () => {
      const validator = new RegisterUserValidator({ email: 'sd@alexdus' });

      await validator.validateEmail();

      expect(validator.errors).toContain('The email must be a valid email address.');
    });

    test('Should add an error to errors array if the email is already in db', async () => {
      const email = faker.internet.email();

      await User.create({
        name: 'Alex',
        password: 'password',
        email,
      });

      const validator = new RegisterUserValidator({ email });

      await validator.validateEmail();

      expect(validator.errors).toContain('A user with this email already exists.');
    })
  });

  describe('isValid Function Test', () => {
    test('Should return false if there are any errors in the errors array', async () => {
      const validator = new RegisterUserValidator({
        name: 'Alex',
        email: 'sd@alexdus',
        password: '12345',
      });

      const validationResult = await validator.isValid();

      expect(validationResult).toBeFalsy();
    });

    test('Should return true if validation passed', async () => {
      const validator = new RegisterUserValidator({
        name: 'Alex Dus',
        email: faker.internet.email(),
        password: 'pass12345',
      });

      const validationResult = await validator.isValid();

      expect(validationResult).toBeTruthy();
    });

    test('Should call validateName, validatePassword, validateEmail functions', async () => {
      const validator = new RegisterUserValidator({
        name: 'Alex',
        email: 'sd@alexdus',
        password: '12345',
      });

      jest.spyOn(validator, 'validateName');
      jest.spyOn(validator, 'validateEmail');
      jest.spyOn(validator, 'validatePassword');

      await validator.isValid();

      expect(validator.validateEmail).toHaveBeenCalled();
      expect(validator.validateName).toHaveBeenCalled();
      expect(validator.validatePassword).toHaveBeenCalled();
    })
  });
});
