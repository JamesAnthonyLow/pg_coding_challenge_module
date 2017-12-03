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

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Subscriber = function () {
  function Subscriber(params, subscriberSchema, pricingSchema) {
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
    this.price = 0.0;
  }

  (0, _createClass3.default)(Subscriber, [{
    key: 'calculatePricing',
    value: function calculatePricing() {
      var _this = this;

      this.price = 0.0;
      (0, _entries2.default)(this.pricingSchema).forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            field = _ref2[0],
            rules = _ref2[1];

        switch (rules.type) {
          case 'base':
            _this.applyBaseRule(rules.rules);
            break;
          case 'integer':
            _this.applyIntegerRule(field, rules.rules);
            break;
          case 'category':
            _this.applyCategoryRule(field, rules.rules);
            break;
          case 'boolean':
            _this.applyBooleanRule(field, rules.rules);
            break;
          default:
            break;
        }
      });
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
  }, {
    key: 'applyBaseRule',
    value: function applyBaseRule(rules) {
      var _this2 = this;

      (0, _entries2.default)(rules).forEach(function (_ref3) {
        var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
            name = _ref4[0],
            rule = _ref4[1];

        switch (name) {
          case 'cost':
            _this2.price += rule;
            break;
          default:
            break;
        }
      });
    }
  }, {
    key: 'applyIntegerRule',
    value: function applyIntegerRule(field, rules) {
      var _this3 = this;

      (0, _entries2.default)(rules).forEach(function (_ref5) {
        var _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
            name = _ref6[0],
            rule = _ref6[1];

        switch (name) {
          case 'bottom_limit':
            if (_this3[field] < rule) {
              throw new Error(field + ' less than bottom limit of ' + rule);
            }
            break;
          case 'bracket':
            if (typeof rule.start === 'undefined' || _this3[field] >= rule.start) {
              var workingValue = _this3[field] - rule.start;
              if (typeof rule.end !== 'undefined' && _this3[field] > rule.end) {
                workingValue -= _this3[field] - rule.end;
              }
              _this3.price += Math.floor(workingValue / rule.interval) * rule.amount;
            }
            break;
          default:
            break;
        }
      });
    }
  }, {
    key: 'applyCategoryRule',
    value: function applyCategoryRule(field, rules) {
      var _this4 = this;

      (0, _entries2.default)(rules).forEach(function (_ref7) {
        var _ref8 = (0, _slicedToArray3.default)(_ref7, 2),
            name = _ref8[0],
            rule = _ref8[1];

        switch (name) {
          case 'category_discount':
            (0, _entries2.default)(rule.fields).forEach(function (_ref9) {
              var _ref10 = (0, _slicedToArray3.default)(_ref9, 2),
                  option = _ref10[0],
                  discount = _ref10[1];

              if (option === _this4[field]) {
                if (rule.type === 'flat') {
                  _this4.price -= discount;
                } else if (rule.type === 'percent') {
                  _this4.price -= discount;
                }
              }
            });
            break;
          default:
            break;
        }
      });
    }
  }, {
    key: 'applyBooleanRule',
    value: function applyBooleanRule(field, rules) {
      var _this5 = this;

      var rule = this[field] ? rules.true : rules.false;
      if (typeof rule !== 'undefined') {
        (0, _entries2.default)(rule).forEach(function (_ref11) {
          var _ref12 = (0, _slicedToArray3.default)(_ref11, 2),
              option = _ref12[0],
              discount = _ref12[1];

          switch (option) {
            case 'percent_increase':
              _this5.price += _this5.price * discount / 100.0;
              break;
            case 'percent_decrease':
              _this5.price -= _this5.price * discount / 100.0;
              break;
            default:
              break;
          }
        });
      }
    }
  }]);
  return Subscriber;
}();

exports.default = Subscriber;