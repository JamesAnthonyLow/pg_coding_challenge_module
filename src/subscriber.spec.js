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
  it('copies required fields', () => {
    const subscriberParams = { name: 'James', age: 26, gender: 'male' };
    const s = new Subscriber(subscriberParams);
    expect(s.name).toBe('James');
    expect(s.age).toBe(26);
    expect(s.gender).toBe('male');
  });
  it('copies optional fields', () => {
    const subscriberParams = {
      name: 'James',
      age: 26,
      gender: 'male',
      hasAllergies: true,
      hasHeartDisease: true,
    };
    const s = new Subscriber(subscriberParams);
    expect(s.name).toBe('James');
    expect(s.age).toBe(26);
    expect(s.gender).toBe('male');
    expect(s.hasAllergies).toBe(true);
    expect(s.hasHeartDisease).toBe(true);
  });
});
