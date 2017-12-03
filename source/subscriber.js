import Pricer from './pricer';
import Validator from './validate';

export default class Subscriber {
  constructor(params, subscriberSchema, pricingSchema) {
    const [valid, err] = Validator.checkSchema(subscriberSchema, params);
    if (!valid) {
      throw new Error(`Invalid input: ${err}`);
    }
    this.pricingSchema = pricingSchema;
    if (typeof this.pricingSchema === 'undefined') {
      throw new Error('Invalid pricing schema');
    }
    this.copyFields(params, subscriberSchema.required);
    this.copyFields(params, subscriberSchema.optional);
  }
  price() {
    let result = 0.0;
    Object.entries(this.pricingSchema).forEach(([field, rules]) => {
      let args = { 
        currentPrice: result, 
        field: field, 
        value: this[field] 
      }
      switch (rules.type) {
        case 'base':
          result += Pricer.applyBaseRule(rules.rules);
          break;
        case 'integer':
          result += Pricer.applyIntegerRule(rules.rules, args);
          break;
        case 'category':
          result += Pricer.applyCategoryRule(rules.rules, args);
          break;
        case 'boolean':
          result += Pricer.applyBooleanRule(rules.rules, args);
          break;
        default:
          break;
      }
    });
    return result;
  }
  copyFields(params, fields) {
    let field;
    if (typeof fields !== 'undefined') {
      for (let i = 0; i < fields.length; i += 1) {
        field = Object.keys(fields[i]);
        if (typeof params[field] !== 'undefined') {
          this[field] = params[field];
        }
      }
    }
  }
}
