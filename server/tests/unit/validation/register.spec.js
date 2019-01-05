import validators from '../../../validators';

const { RegisterUserValidator } = validators;

describe('RegisterUserValidator class', () => {
  describe('Validate name function', () => {
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
    })
  })
})
