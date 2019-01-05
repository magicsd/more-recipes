import validators from '../../../validators';

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
});
