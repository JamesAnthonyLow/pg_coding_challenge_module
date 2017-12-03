'use strict';

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = {
  required: [{ name: 'string' }, { age: 'number' }, { gender: 'string' }],
  optional: [{ hasAllergies: 'boolean' }, { hasSleepApnea: 'boolean' }, { hasHeartDisease: 'boolean' }]
};

describe('checkSchema', function () {
  it('returns false if any fields are missing', function () {
    var subscriber = { name: 'James' };
    expect(_validate2.default.checkSchema(schema, subscriber)).toEqual([false, 'required field age undefined']);
  });
  it('returns true if all required fields are present', function () {
    var subscriber = { name: 'James', gender: 'Male', age: 26 };
    expect(_validate2.default.checkSchema(schema, subscriber)).toEqual([true, '']);
  });
  it('returns false if the type is incorrect for an optional field', function () {
    var subscriber = {
      name: 'James', gender: 'Male', age: 26, hasAllergies: 'true'
    };
    expect(_validate2.default.checkSchema(schema, subscriber)).toEqual([false, 'field hasAllergies must be boolean']);
  });
});