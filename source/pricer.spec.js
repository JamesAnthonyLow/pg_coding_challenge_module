import Pricer from './pricer';

describe('Pricing functions in Subscriber class', () => {
  describe('applyBaseRule', () => {
    it('adds base cost', () => {
      let rules = { cost: 100 };
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
      expect(Pricer.applyIntegerRule(rules, { currentPrice: 0.0, field: 'age', value: 50 })).
        toBeCloseTo(120, 2);
    });
    it('throws error if bottom_limit not met', () => {
      expect(() => { Pricer.applyIntegerRule(rules, { currentPrice: 0.0, field: 'age', value: 16 }); })
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
      expect(Pricer.applyCategoryRule(rules, { currentPrice: 0.0, field: 'gender', value: 'female' })).toBeCloseTo(-12, 2);
    });
    it('does nothing if male', () => {
      expect(Pricer.applyCategoryRule(rules, { currentPrice: 0.0, field: 'gender', value: 'male' })).toBeCloseTo(0, 2);
    });
  });
  describe('applyBooleanRule', () => {
    it('applies appropriate discount/increase for condition', () => {
      const rules = {
        true: {
          percent_increase: 1,
        },
      };
      expect(Pricer.applyBooleanRule(rules, { currentPrice: 100.0, field: 'hasAllergies', value: 'true' })).toBeCloseTo(1, 2);
    });
  });
});
