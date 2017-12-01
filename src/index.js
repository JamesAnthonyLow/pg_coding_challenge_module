import Subscriber from './subscriber';
const kelly = new Subscriber({
  name: 'Kelly', age: 50, gender: 'female', hasAllergies: true,
});
const Josh = new Subscriber({
  name: 'Josh', age: 40, gender: 'male', hasSleepApnea: true,
});
const Brad = new Subscriber({
  name: 'Brad', age: 20, gender: 'male', hasHeartDisease: true,
});

kelly.calculatePricing();
console.log(`${kelly.name} - $${kelly.price.toFixed(2)}`);
Josh.calculatePricing();
console.log(`${Josh.name} - $${Josh.price.toFixed(2)}`);
Brad.calculatePricing();
console.log(`${Brad.name} - $${Brad.price.toFixed(2)}`);
