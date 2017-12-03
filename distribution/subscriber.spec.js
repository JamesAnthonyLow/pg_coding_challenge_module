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

describe('Subscriber', function () {
  it('throws an error if params do not match schema in subscriber config', function () {
    var subscriberParams = { name: 'James' };
    expect(function () {
      new _subscriber2.default(subscriberParams, subscriberSchema, pricingSchema);
    }).toThrow(new Error('Invalid input: required field age undefined'));
  });
  it('copies required fields', function () {
    var subscriberParams = { name: 'James', age: 26, gender: 'male' };
    var s = new _subscriber2.default(subscriberParams, subscriberSchema, pricingSchema);
    expect(s.name).toBe('James');
    expect(s.age).toBe(26);
    expect(s.gender).toBe('male');
  });
  it('copies optional fields', function () {
    var subscriberParams = {
      name: 'James',
      age: 26,
      gender: 'male',
      hasAllergies: true,
      hasHeartDisease: true
    };
    var s = new _subscriber2.default(subscriberParams, subscriberSchema, pricingSchema);
    expect(s.name).toBe('James');
    expect(s.age).toBe(26);
    expect(s.gender).toBe('male');
    expect(s.hasAllergies).toBe(true);
    expect(s.hasHeartDisease).toBe(true);
  });
});