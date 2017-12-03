'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Validator = {
  checkSchema: function checkSchema(schema, obj) {
    if (schema.required.length === 'undefined' && schema.optional.length === 'undefined') {
      return [false, 'schema is invalid'];
    }
    var field = void 0;
    var type = void 0;
    var i = void 0;
    for (i = 0; i < schema.required.length; i += 1) {
      field = (0, _keys2.default)(schema.required[i]);
      type = (0, _typeof3.default)(obj[field]);
      if (type === 'undefined') {
        return [false, 'required field ' + field + ' undefined'];
      }
      if (type !== schema.required[i][field]) {
        return [false, 'field ' + field + ' must be ' + type];
      }
    }
    for (i = 0; i < schema.optional.length; i += 1) {
      field = (0, _keys2.default)(schema.optional[i]);
      type = (0, _typeof3.default)(obj[field]);
      if (type !== schema.optional[i][field]) {
        if (typeof obj[field] !== 'undefined') {
          return [false, 'field ' + field + ' must be ' + schema.optional[i][field]];
        }
      }
    }
    return [true, ''];
  }
};

exports.default = Validator;