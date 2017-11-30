import Validator from './validate' 

const schema = {
  required:[
    {name: "String"},
    {age: "Number"},
    {gender:"boolean"}
  ],
  optional: [
    {hasAllergies:"boolean"},
    {hasSleepApnea:"boolean"},
    {hasHeartDisease:"boolean"}
  ]
}

describe('checkSchema', () => {
  it ('returns false if any files are missing', () => {
    let subscriber = { name: "James" };
    expect(Validator.checkSchema(schema, subscriber)).toBe(false);
  });
});
