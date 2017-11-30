import Conf from './config';
import getConfigFromPath from './getConfigFromPath';
import Validator from './validate';

class Subscriber {
  _copyFields(params, fields) {
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
    this._copyFields(params, subscriberSchema.required);
    this._copyFields(params, subscriberSchema.optional);
  }
}

export default Subscriber;
