import Conf from './config';
import Validator from './validate';

class Subscriber {
  constructor(params){
    const subscriberSchema = require(`${Conf.root}/${Conf.subscriber.path}`);
    if (!Validator.checkSchema(subscriberSchema, params)) {
      throw new Error('Invalid input for subscriber class');
    }
  }
};

export default Subscriber;
