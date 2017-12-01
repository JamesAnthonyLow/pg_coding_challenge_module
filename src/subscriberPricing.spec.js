import Subscriber from './subscriber';

describe('Pricing functions in Subscriber class', () => {
  let s;
  beforeEach(() => {
    s = new Subscriber({
      name: 'Kelly', age: 50, gender: 'female', hasAllergies: true,
    });
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
      });
      kelly.calculatePricing();
      expect(kelly.price).toBeCloseTo(210.20, 2);
    });
    it('calculates correct price for Josh', () => {
      const Josh = new Subscriber({
        name: 'Josh', age: 40, gender: 'male', hasSleepApnea: true,
      });
      Josh.calculatePricing();
      expect(Josh.price).toBeCloseTo(190.80, 2);
    });
    it('calculates correct price for Brad', () => {
      const Brad = new Subscriber({
        name: 'Brad', age: 20, gender: 'male', hasHeartDisease: true,
      });
      Brad.calculatePricing();
      expect(Brad.price).toBeCloseTo(117.00, 2);
    });
  });
});
