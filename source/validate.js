const Validator = {
  checkSchema(schema, obj) {
    if (schema.required.length === 'undefined' &&
        schema.optional.length === 'undefined') {
      return [false, 'schema is invalid'];
    }
    let field;
    let type;
    let i;
    for (i = 0; i < schema.required.length; i += 1) {
      field = Object.keys(schema.required[i]);
      type = typeof obj[field];
      if (type === 'undefined') {
        return [false, `required field ${field} undefined`];
      }
      if (type !== schema.required[i][field]) {
        return [false, `field ${field} must be ${schema.required[i][field]}`];
      }
    }
    for (i = 0; i < schema.optional.length; i += 1) {
      field = Object.keys(schema.optional[i]);
      type = typeof obj[field];
      if (type !== schema.optional[i][field]) {
        if (typeof obj[field] !== 'undefined') {
          return [false, `field ${field} must be ${schema.optional[i][field]}`];
        }
      }
    }
    return [true, ''];
  },
};

export default Validator;
