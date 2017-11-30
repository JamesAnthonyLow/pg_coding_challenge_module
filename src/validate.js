const Validator = {
  checkSchema(schema, obj) {
    if (schema.required.length === 'undefined' &&
        schema.optional.length === 'undefined') {
      // one of these fields must exist as an array
      return false;
    }
    let field;
    let type;
    let i;
    for (i = 0; i < schema.required.length; i += 1) {
      field = Object.keys(schema.required[i]);
      type = typeof obj[field];
      if (type !== schema.required[i][field]) {
        // return false if type incorrect or undefined
        return false;
      }
    }
    for (i = 0; i < schema.optional.length; i += 1) {
      field = Object.keys(schema.optional[i]);
      type = typeof obj[field];
      if (type !== schema.optional[i][field]) {
        // return false if type incorrect; true if undefined
        return (typeof obj[field] === 'undefined');
      }
    }
    return true;
  },
};

export default Validator;
