'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pricer = function () {
  function Pricer() {
    (0, _classCallCheck3.default)(this, Pricer);
  }

  (0, _createClass3.default)(Pricer, null, [{
    key: 'applyBaseRule',
    value: function applyBaseRule(rules) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          currentPrice = _ref.currentPrice,
          field = _ref.field,
          value = _ref.value;

      // currentPrice arg not used but it could be in the future
      var adjustment = 0;
      (0, _entries2.default)(rules).forEach(function (_ref2) {
        var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
            name = _ref3[0],
            rule = _ref3[1];

        switch (name) {
          case 'cost':
            adjustment += rule;
            break;
          default:
            break;
        }
      });
      return adjustment;
    }
  }, {
    key: 'applyIntegerRule',
    value: function applyIntegerRule(rules) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          currentPrice = _ref4.currentPrice,
          field = _ref4.field,
          value = _ref4.value;

      // currentPrice arg not used but it could be in the future
      var adjustment = 0;
      (0, _entries2.default)(rules).forEach(function (_ref5) {
        var _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
            name = _ref6[0],
            rule = _ref6[1];

        switch (name) {
          case 'bottom_limit':
            if (value < rule) {
              throw new Error(field + ' less than bottom limit of ' + rule);
            }
            break;
          case 'bracket':
            if (typeof rule.start === 'undefined' || value >= rule.start) {
              var workingValue = value - rule.start;
              if (typeof rule.end !== 'undefined' && value > rule.end) {
                workingValue -= value - rule.end;
              }
              adjustment += Math.floor(workingValue / rule.interval) * rule.amount;
            }
            break;
          default:
            break;
        }
      });
      return adjustment;
    }
  }, {
    key: 'applyCategoryRule',
    value: function applyCategoryRule(rules) {
      var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          currentPrice = _ref7.currentPrice,
          field = _ref7.field,
          value = _ref7.value;

      // currentPrice and field arg not used but they could be in the future
      var adjustment = 0;
      (0, _entries2.default)(rules).forEach(function (_ref8) {
        var _ref9 = (0, _slicedToArray3.default)(_ref8, 2),
            name = _ref9[0],
            rule = _ref9[1];

        switch (name) {
          case 'category_discount':
            (0, _entries2.default)(rule.fields).forEach(function (_ref10) {
              var _ref11 = (0, _slicedToArray3.default)(_ref10, 2),
                  option = _ref11[0],
                  discount = _ref11[1];

              if (option === value) {
                if (rule.type === 'flat') {
                  adjustment -= discount;
                } else if (rule.type === 'percent') {
                  adjustment -= discount;
                }
              }
            });
            break;
          default:
            break;
        }
      });
      return adjustment;
    }
  }, {
    key: 'applyBooleanRule',
    value: function applyBooleanRule(rules) {
      var _ref12 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          currentPrice = _ref12.currentPrice,
          field = _ref12.field,
          value = _ref12.value;

      // currentPrice and field arg not used but they could be in the future
      var adjustment = 0;
      var rule = value ? rules.true : rules.false;
      if (typeof rule !== 'undefined') {
        (0, _entries2.default)(rule).forEach(function (_ref13) {
          var _ref14 = (0, _slicedToArray3.default)(_ref13, 2),
              option = _ref14[0],
              discount = _ref14[1];

          switch (option) {
            case 'percent_increase':
              adjustment += currentPrice * discount / 100.0;
              break;
            case 'percent_decrease':
              adjustment -= currentPrice * discount / 100.0;
              break;
            default:
              break;
          }
        });
      }
      return adjustment;
    }
  }]);
  return Pricer;
}();

exports.default = Pricer;