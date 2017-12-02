import Subscriber from './subscriber';
const subscriberSchema = {
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
const pricingSchema = {
  base: {
    type: 'base',
    rules: {
      cost: 100,
    },
  },
  age: {
    type: 'integer',
    rules: {
      bottom_limit: 18,
      bracket: {
        start: 18,
        interval: 5,
        amount: 20,
      },
    },
  },
  hasAllergies: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 1,
      },
    },
  },
  hasSleepApnea: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 6,
      },
    },
  },
  hasHeartDisease: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 17,
      },
    },
  },
  gender: {
    type: 'category',
    rules: {
      category_discount: {
        type: 'flat',
        fields: {
          male: 0,
          female: 12,
        },
      },
    },
  },
};

describe('Subscriber', () => {
  it('throws an error if params do not match schema in subscriber config', () => {
    const subscriberParams = { name: 'James' };
    expect(() => {
      new Subscriber(subscriberParams, subscriberSchema, pricingSchema);
    }).toThrow(new Error('Invalid input: required field age undefined'));
  });
  it('copies required fields', () => {
    const subscriberParams = { name: 'James', age: 26, gender: 'male' };
    const s = new Subscriber(subscriberParams, subscriberSchema, pricingSchema);
    expect(s.name).toBe('James');
    expect(s.age).toBe(26);
    expect(s.gender).toBe('male');
  });
  it('copies optional fields', () => {
    const subscriberParams = {
      name: 'James',
      age: 26,
      gender: 'male',
      hasAllergies: true,
      hasHeartDisease: true,
    };
    const s = new Subscriber(subscriberParams, subscriberSchema, pricingSchema);
    expect(s.name).toBe('James');
    expect(s.age).toBe(26);
    expect(s.gender).toBe('male');
    expect(s.hasAllergies).toBe(true);
    expect(s.hasHeartDisease).toBe(true);
  });
});
