import Conf from './config';
import Validator from './validate';

class Subscriber {
  constructor(params){
    const subscriberSchema = require(`${Conf.root}/${Conf.subscriber.path}`);
    let [valid, err] = Validator.checkSchema(subscriberSchema, params)
    if (!valid) {
      throw new Error(`Invalid input: ${err}`);
    }
  }
};

export default Subscriber;
