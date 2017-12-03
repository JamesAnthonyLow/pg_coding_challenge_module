'use strict';

var _pricer = require('./pricer');

var _pricer2 = _interopRequireDefault(_pricer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Pricing functions in Subscriber class', function () {
  describe('applyBaseRule', function () {
    it('adds base cost', function () {
      var rules = { cost: 100 };
      expect(_pricer2.default.applyBaseRule(rules)).toBeCloseTo(100, 2);
    });
  });
  describe('applyIntegerRule', function () {
    var rules = {
      bottom_limit: 18,
      bracket: {
        start: 18,
        interval: 5,
        amount: 20
      }
    };
    it('adds increase based on age', function () {
      expect(_pricer2.default.applyIntegerRule(rules, { currentPrice: 0.0, field: 'age', value: 50 })).toBeCloseTo(120, 2);
    });
    it('throws error if bottom_limit not met', function () {
      expect(function () {
        _pricer2.default.applyIntegerRule(rules, { currentPrice: 0.0, field: 'age', value: 16 });
      }).toThrow(new Error('age less than bottom limit of 18'));
    });
  });
  describe('applyCategoryRule', function () {
    var rules = {
      category_discount: {
        type: 'flat',
        fields: {
          male: 0,
          female: 12
        }
      }
    };
    it('discounts if female', function () {
      expect(_pricer2.default.applyCategoryRule(rules, { currentPrice: 0.0, field: 'gender', value: 'female' })).toBeCloseTo(-12, 2);
    });
    it('does nothing if male', function () {
      expect(_pricer2.default.applyCategoryRule(rules, { currentPrice: 0.0, field: 'gender', value: 'male' })).toBeCloseTo(0, 2);
    });
  });
  describe('applyBooleanRule', function () {
    it('applies appropriate discount/increase for condition', function () {
      var rules = {
        true: {
          percent_increase: 1
        }
      };
      expect(_pricer2.default.applyBooleanRule(rules, { currentPrice: 100.0, field: 'hasAllergies', value: 'true' })).toBeCloseTo(1, 2);
    });
  });
});