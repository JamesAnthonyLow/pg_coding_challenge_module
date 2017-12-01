import Conf from './config';
import getConfigFromPath from './getConfigFromPath';
import Validator from './validate';

export default class Subscriber {
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
  constructor(params) {
    const subscriberSchema = getConfigFromPath(Conf.subscriber);
    const [valid, err] = Validator.checkSchema(subscriberSchema, params);
    if (!valid) {
      throw new Error(`Invalid input: ${err}`);
    }
    this.pricingSchema = getConfigFromPath(Conf.pricing);
    if (typeof this.pricingSchema === 'undefined') {
      throw new Error('Invalid pricing schema');
    }
    this.copyFields(params, subscriberSchema.required);
    this.copyFields(params, subscriberSchema.optional);
  }
  applyBaseRule(rules) {
    Object.entries(rules).forEach((name, rule) => {
      switch (name) {
        case 'cost':
          this.price += rule;
          break;
        default:
          break;
      }
    });
  }
  applyIntegerRule(field, rules) {
    Object.entries(rules).forEach((name, rule) => {
      switch (name) {
        case 'bottom_limit':
          if (this[field] < rule) {
            throw new Error(`${field} less than bottom limit of ${rule}`);
          }
          break;
        case 'bracket':
          if (typeof rule.start === 'undefined' || this[field] >= rule.start) {
            let workingValue = this[field] - rule.start;
            if (typeof rulestop !== 'undefined' && this[field] > rule.end) {
              workingValue -= (this[field] - rule.end);
            }
            this.price += ((workingValue / rule.interval) * rule.amount);
          }
          break;
        default:
          break;
      }
    });
  }
  applyCategoryRule(field, rules) {
  }
  calculatePricing() {
    const fields = Object.keys(this.pricingSchema);
    this.price = 0;
    Object.entries(fields).forEach((field, rules) => {
      switch (field.type) {
        case 'base':
          this.applyBaseRule(rules.rules);
          break;
        case 'integer':
          this.applyIntegerRule(field, rules.rules);
          break;
        default:
          break;
      }
    });
  }
}
