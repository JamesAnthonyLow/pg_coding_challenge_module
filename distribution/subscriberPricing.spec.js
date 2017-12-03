'use strict';

var _subscriber = require('./subscriber');

var _subscriber2 = _interopRequireDefault(_subscriber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subscriberSchema = {
  required: [{ name: 'string' }, { age: 'number' }, { gender: 'string' }],
  optional: [{ hasAllergies: 'boolean' }, { hasSleepApnea: 'boolean' }, { hasHeartDisease: 'boolean' }]
};
var pricingSchema = {
  base: {
    type: 'base',
    rules: {
      cost: 100
    }
  },
  age: {
    type: 'integer',
    rules: {
      bottom_limit: 18,
      bracket: {
        start: 18,
        interval: 5,
        amount: 20
      }
    }
  },
  hasAllergies: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 1
      }
    }
  },
  hasSleepApnea: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 6
      }
    }
  },
  hasHeartDisease: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 17
      }
    }
  },
  gender: {
    type: 'category',
    rules: {
      category_discount: {
        type: 'flat',
        fields: {
          male: 0,
          female: 12
        }
      }
    }
  }
};

describe('Pricing functions in Subscriber class', function () {
  var s = void 0;
  beforeEach(function () {
    s = new _subscriber2.default({
      name: 'Kelly', age: 50, gender: 'female', hasAllergies: true
    }, subscriberSchema, pricingSchema);
  });
  describe('applyBaseRule', function () {
    it('adds base cost', function () {
      s.applyBaseRule(s.pricingSchema.base.rules);
      expect(s.price).toBeCloseTo(100, 2);
    });
  });
  describe('applyIntegerRule', function () {
    it('adds increase based on age', function () {
      s.applyIntegerRule('age', s.pricingSchema.age.rules);
      expect(s.price).toBeCloseTo(120, 2);
    });
  });
  describe('applyCategoryRule', function () {
    it('discounts if female', function () {
      s.applyCategoryRule('gender', s.pricingSchema.gender.rules);
      expect(s.price).toBeCloseTo(-12, 2);
    });
    it('does nothing if male', function () {
      s.gender = 'male';
      s.applyCategoryRule('gender', s.pricingSchema.gender.rules);
      expect(s.price).toBeCloseTo(0, 2);
    });
  });
  describe('applyBooleanRule', function () {
    it('applies appropriate discount/increase for condition', function () {
      s.price = 100;
      s.applyBooleanRule('hasAllergies', s.pricingSchema.hasAllergies.rules);
      expect(s.price).toBeCloseTo(101, 2);
    });
  });
  describe('calculatePricing', function () {
    it('calculates correct price for kelly', function () {
      var kelly = new _subscriber2.default({
        name: 'Kelly', age: 50, gender: 'female', hasAllergies: true
      }, subscriberSchema, pricingSchema);
      kelly.calculatePricing();
      expect(kelly.price).toBeCloseTo(210.20, 2);
    });
    it('calculates correct price for Josh', function () {
      var Josh = new _subscriber2.default({
        name: 'Josh', age: 40, gender: 'male', hasSleepApnea: true
      }, subscriberSchema, pricingSchema);
      Josh.calculatePricing();
      expect(Josh.price).toBeCloseTo(190.80, 2);
    });
    it('calculates correct price for Brad', function () {
      var Brad = new _subscriber2.default({
        name: 'Brad', age: 20, gender: 'male', hasHeartDisease: true
      }, subscriberSchema, pricingSchema);
      Brad.calculatePricing();
      expect(Brad.price).toBeCloseTo(117.00, 2);
    });
  });
});