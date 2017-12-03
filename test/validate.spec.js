import Validator from '../source/validate';


const schema = {
  required: [
    { name: 'string' },
    { age: 'number' },
    { gender: 'string' },
  ],
  optional: [
    { hasAllergies: 'boolean' },
    { hasSleepApnea: 'boolean' },
    { hasHeartDisease: 'boolean' },
  ],
};

describe('checkSchema', () => {
  it('returns false if any fields are missing', () => {
    const subscriber = { name: 'James' };
    expect(Validator.checkSchema(schema, subscriber)).toEqual([false, 'required field age undefined']);
  });
  it('returns true if all required fields are present', () => {
    const subscriber = { name: 'James', gender: 'Male', age: 26 };
    expect(Validator.checkSchema(schema, subscriber)).toEqual([true, '']);
  });
  it('returns false if the type is incorrect for an optional field', () => {
    const subscriber = {
      name: 'James', gender: 'Male', age: 26, hasAllergies: 'true',
    };
    expect(Validator.checkSchema(schema, subscriber)).toEqual([false, 'field hasAllergies must be boolean']);
  });
});
