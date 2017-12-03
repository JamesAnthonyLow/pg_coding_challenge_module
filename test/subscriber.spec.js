import Subscriber from '../source/subscriber';
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
  describe('calculatePricing', () => {
    it('calculates correct price for kelly', () => {
      expect(new Subscriber({
        name: 'Kelly', age: 50, gender: 'female', hasAllergies: true,
      }, subscriberSchema, pricingSchema).price()).toBeCloseTo(210.20, 2);
    });
    it('calculates correct price for Josh', () => {
      const Josh = new Subscriber({
        name: 'Josh', age: 40, gender: 'male', hasSleepApnea: true,
      }, subscriberSchema, pricingSchema);
      expect(Josh.price()).toBeCloseTo(190.80, 2);
    });
    it('calculates correct price for Brad', () => {
      const Brad = new Subscriber({
        name: 'Brad', age: 20, gender: 'male', hasHeartDisease: true,
      }, subscriberSchema, pricingSchema);
      expect(Brad.price()).toBeCloseTo(117.00, 2);
    });
  });
});
