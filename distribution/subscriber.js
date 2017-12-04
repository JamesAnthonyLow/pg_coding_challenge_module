'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _pricer = require('./pricer');

var _pricer2 = _interopRequireDefault(_pricer);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Subscriber = function () {
  function Subscriber() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        params = _ref.params,
        subscriberSchema = _ref.subscriberSchema,
        pricingSchema = _ref.pricingSchema;

    (0, _classCallCheck3.default)(this, Subscriber);

    var _Validator$checkSchem = _validate2.default.checkSchema(subscriberSchema, params),
        _Validator$checkSchem2 = (0, _slicedToArray3.default)(_Validator$checkSchem, 2),
        valid = _Validator$checkSchem2[0],
        err = _Validator$checkSchem2[1];

    if (!valid) {
      throw new Error('Invalid input: ' + err);
    }
    this.pricingSchema = pricingSchema;
    if (typeof this.pricingSchema === 'undefined') {
      throw new Error('Invalid pricing schema');
    }
    this.copyFields(params, subscriberSchema.required);
    this.copyFields(params, subscriberSchema.optional);
  }

  (0, _createClass3.default)(Subscriber, [{
    key: 'price',
    value: function price() {
      var _this = this;

      var result = 0.0;
      (0, _entries2.default)(this.pricingSchema).forEach(function (_ref2) {
        var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
            field = _ref3[0],
            rules = _ref3[1];

        var args = { currentPrice: result, field: field, value: _this[field] };
        switch (rules.type) {
          case 'base':
            result += _pricer2.default.applyBaseRule(rules.rules, args);
            break;
          case 'integer':
            result += _pricer2.default.applyIntegerRule(rules.rules, args);
            break;
          case 'category':
            result += _pricer2.default.applyCategoryRule(rules.rules, args);
            break;
          case 'boolean':
            result += _pricer2.default.applyBooleanRule(rules.rules, args);
            break;
          default:
            break;
        }
      });
      return result;
    }
  }, {
    key: 'copyFields',
    value: function copyFields(params, fields) {
      var field = void 0;
      if (typeof fields !== 'undefined') {
        for (var i = 0; i < fields.length; i += 1) {
          field = (0, _keys2.default)(fields[i]);
          if (typeof params[field] !== 'undefined') {
            this[field] = params[field];
          }
        }
      }
    }
  }]);
  return Subscriber;
}();

exports.default = Subscriber;