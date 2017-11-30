import Conf from './config';
import getConfigFromPath from './getConfigFromPath';
import Validator from './validate';

class Subscriber {
  constructor(params) {
    const subscriberSchema = getConfigFromPath(Conf.subscriber);
    const [valid, err] = Validator.checkSchema(subscriberSchema, params);
    if (!valid) {
      throw new Error(`Invalid input: ${err}`);
    }
    this.pricingSchema = getConfigFromPath(Conf.pricing);
  }
}

export default Subscriber;
