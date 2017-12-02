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

describe('Pricing functions in Subscriber class', () => {
  let s;
  beforeEach(() => {
    s = new Subscriber({
      name: 'Kelly', age: 50, gender: 'female', hasAllergies: true,
    }, subscriberSchema, pricingSchema);
  });
  describe('applyBaseRule', () => {
    it('adds base cost', () => {
      s.applyBaseRule(s.pricingSchema.base.rules);
      expect(s.price).toBeCloseTo(100, 2);
    });
  });
  describe('applyIntegerRule', () => {
    it('adds increase based on age', () => {
      s.applyIntegerRule('age', s.pricingSchema.age.rules);
      expect(s.price).toBeCloseTo(120, 2);
    });
  });
  describe('applyCategoryRule', () => {
    it('discounts if female', () => {
      s.applyCategoryRule('gender', s.pricingSchema.gender.rules);
      expect(s.price).toBeCloseTo(-12, 2);
    });
    it('does nothing if male', () => {
      s.gender = 'male';
      s.applyCategoryRule('gender', s.pricingSchema.gender.rules);
      expect(s.price).toBeCloseTo(0, 2);
    });
  });
  describe('applyBooleanRule', () => {
    it('applies appropriate discount/increase for condition', () => {
      s.price = 100;
      s.applyBooleanRule('hasAllergies', s.pricingSchema.hasAllergies.rules);
      expect(s.price).toBeCloseTo(101, 2);
    });
  });
  describe('calculatePricing', () => {
    it('calculates correct price for kelly', () => {
      const kelly = new Subscriber({
        name: 'Kelly', age: 50, gender: 'female', hasAllergies: true,
      }, subscriberSchema, pricingSchema);
      kelly.calculatePricing();
      expect(kelly.price).toBeCloseTo(210.20, 2);
    });
    it('calculates correct price for Josh', () => {
      const Josh = new Subscriber({
        name: 'Josh', age: 40, gender: 'male', hasSleepApnea: true,
      }, subscriberSchema, pricingSchema);
      Josh.calculatePricing();
      expect(Josh.price).toBeCloseTo(190.80, 2);
    });
    it('calculates correct price for Brad', () => {
      const Brad = new Subscriber({
        name: 'Brad', age: 20, gender: 'male', hasHeartDisease: true,
      }, subscriberSchema, pricingSchema);
      Brad.calculatePricing();
      expect(Brad.price).toBeCloseTo(117.00, 2);
    });
  });
});
