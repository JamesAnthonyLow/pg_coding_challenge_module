import Subscriber from './subscriber';
//  schema subscriber.config.json
/*  {
 *    "required":[
 *      {"name": "string"},
 *      {"age": "number"},
 *      {"gender":"string"}
 *    ],
 *    "optional": [
 *      {"hasAllergies":"boolean"},
 *      {"hasSleepApnea":"boolean"},
 *      {"hasHeartDisease": "boolean"}
 *    ]
 *  }
 */

describe('Subscriber', () => {
  it('throws an error if params do not match schema in subscriber config', () => {
    const subscriberParams = { name: 'James' };
    expect(() => {
      new Subscriber(subscriberParams);
    }).toThrow(new Error('Invalid input: required field age undefined'));
  });
});
