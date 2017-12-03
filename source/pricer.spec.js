import Pricer from './pricer';
describe('Pricing functions in Subscriber class', () => {
  describe('applyBaseRule', () => {
    const rules = { cost: 100 };
    it('adds base cost', () => {
      expect(Pricer.applyBaseRule(rules)).toBeCloseTo(100, 2);
    });
  });
  describe('applyIntegerRule', () => {
    const rules = {
      bottom_limit: 18,
      bracket: {
        start: 18,
        interval: 5,
        amount: 20,
      },
    };
    it('adds increase based on age', () => {
      expect(Pricer.applyIntegerRule(0.0, 'age', 50, rules)).toBeCloseTo(120, 2);
    });
    it('throws error if bottom_limit not met', () => {
      expect(() => { Pricer.applyIntegerRule(0.0, 'age', 16, rules); })
        .toThrow(new Error('age less than bottom limit of 18'));
    });
  });
  describe('applyCategoryRule', () => {
    const rules = {
      category_discount: {
        type: 'flat',
        fields: {
          male: 0,
          female: 12,
        },
      },
    };
    it('discounts if female', () => {
      expect(Pricer.applyCategoryRule(0.0, 'gender', 'female', rules)).toBeCloseTo(-12, 2);
    });
    it('does nothing if male', () => {
      expect(Pricer.applyCategoryRule(0.0, 'gender', 'male', rules)).toBeCloseTo(0, 2);
    });
  });
  describe('applyBooleanRule', () => {
    it('applies appropriate discount/increase for condition', () => {
      const rules = {
        true: {
          percent_increase: 1,
        },
      };
      expect(Pricer.applyBooleanRule(100, 'hasAllergies', 'true', rules)).toBeCloseTo(1, 2);
    });
  });
});
