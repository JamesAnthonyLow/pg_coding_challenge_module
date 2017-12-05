### James Lowenthal's PG Coding Challenge Module

The PG Coding Challenge Module provides a solution to [this](https://docs.google.com/document/d/15f4hiBdM26FcEdJDLWt7tacP5Jic5StUlwv4JLxT9BU/edit) interview spec.

It is a node and front-end compatible module that allows the dynamic specification of insurance pricing models using JSON.  Developers can specify what information normally consists of a "Subscriber" entry in one JSON object and describe the setup of the pricing model in another JSON object.

**Design Decision #1:  The module was written to accept two JSON "schemas" to describe the input and the calculation of the output in order to enable the system to be able to be updated by simply editing the JSON objects.  JSON is supported in many languages on many platforms and could potentially be served from a remote database completely separate from the PG Coding Challenge Module allowing future scaling to involve the introduction of new implementations of the core functionality as well as automated adjustments to the JSON schemas.**

### Installation

This project requires ```node``` and ```npm```.  To get started simply run ```npm install``` to pull down the required node modules.  Once installed you can run the following ```npm``` scripts specified in [```package.json```](https://github.com/JamesAnthonyLow/pg_coding_challenge_module/blob/master/package.json).

```
$ npm run test ## to run tests in ./test directory using the jest module
$ npm run lint ## to run eslint using the policygenius configuration
$ npm run build ## to transpile the es6 code in the ./source directory to node compatible es5 in the ./distribution directory 
```

### Usage

PG Coding Challenge Module consists of a Subscriber class, a Pricer module, and a Validator module.  The primary usage of the module is to instantiate an instance of the Subscriber class, and in fact this is the only interface publically available.  To calculate the price of a subscriber's insurance you simply instantiate an instance of Subscriber with a) the parameters for that subscriber b) a subscriber "schema" describing the valid contents of a subscriber and c) a pricing "schema" describing the pricing model.  Both the subscriber and pricing schemas are written in JSON. The Subscriber class constructor will then check the Subscriber parameters against the description provided by the subscriber schema using the Validator module and copy the relevant fields to itself.  Finally when it is time to access the price you call the virtual getter ```price()``` on the Subscriber object to obtain the subscriber's insurance cost.  The ```price()``` method utilizes several routines from the Pricer module to dynamically interpret the pricing schema and provide a calculation:

```es6
import Subscriber from 'pg_coding_challenge_module';

const subscriberSchema = {
  // full example below
};

const pricingSchema = {
  // full example below
};

// named parameters are passed as an object
let s = new Subscriber({
        params: {
          name: 'Kelly', 
          age: 50, 
          gender: 'female',
          hasAllergies: true,
        }, 
        subscriberSchema: subscriberSchema, 
        pricingSchema: pricingSchema 
      });

console.log(`${s.name()} - $${s.price().toFixed(2)}`);
// will print "Kelly - $210.20"
```

### Subscriber Schema

```es6
const subscriberSchema = {
  required: [
    { name: 'string' },
    { age: 'number' },
    { gender: 'string' },
  ],
  optional: [
    { hasAllergies: 'boolean' },
    { hasSleepApnea: 'boolean' },
    { hasHeartDisease: 'boolean' },
  ],
};
```

The subscriber "schema" JSON object consists of two keys ```required``` and ```optional``` that specify the required and optional Subscriber fields respectively.  Each key corresponds to an array consisting of a key that will be the name of the field and a string that corresponds to the data type of said field.  The Validator module currently uses ```typeof``` in order to validate the types of the input.

**Design Decision #2: Rudimentary type checking using ```typeof``` was implemented due to the author's lack of familiarity with the node ecosystem, in the future it would be valuable to replace the use of the ```typeof``` keyword with a more mature system.  Some sort of type checking was deemed necessary in this instance because the PG Code Challenge Module is dependent upon the notion that developers could specify pricing rules in JSON that would depend upon the correct inputs specified in a separate subscriber JSON file.**

### Pricing Schema

```es6
const pricingSchema = {
  base: {
    type: 'base',
    rules: {
      cost: 100,
    },
  },
  age: {
    type: 'integer',
    rules: {
      bottom_limit: 18,
      bracket: {
        start: 18,
        interval: 5,
        amount: 20,
      },
    },
  },
  hasAllergies: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 1,
      },
    },
  },
  hasSleepApnea: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 6,
      },
    },
  },
  hasHeartDisease: {
    type: 'boolean',
    rules: {
      true: {
        percent_increase: 17,
      },
    },
  },
  gender: {
    type: 'category',
    rules: {
      category_discount: {
        type: 'flat',
        fields: {
          male: 0,
          female: 12,
        },
      },
    },
  },
};
```

The Pricing schema consists of keys corresponding the the relevant field names.  The values of the keys are nested objects that consist of a ```type``` key-value pair and a ```rules``` key value pair.  The valid types currently available are ```base```, ```integer```, ```category```, and ```boolean```.  Each type has a corresponding routine in the Pricer module that gets called in the Subscriber class ```price()``` method in order to apply the provided rules:

- ```applyBaseRule``` - applies a base fixed cost.
- ```applyIntegerRule```  - applies rules dependent upon an integer field, such as a bracketed price increase.
- ```applyCategoryRule``` - applies rules for each option in a category, such as a discount or price increase corresponding to male/female.
- ```applyBooleanRule``` - applies rules depending on whether or not a boolean field is either ```undefined```, true, or false.

**Design Decision #3: The Pricing schema is parsed in order from top to bottom (i.e, if you want the base cost to be added before everything else you include it at the top of the file).  A field specifying calculation order was considered however it was determined that this added complexibility and reduced readibility while at the same time slowing down the parsing of the pricing rules by several orders of magnitude.**

**Design Decision #4: Currently very few options beyond what is necessary for satisfying the spec are implemented in the Pricer module.  The idea is that because of the infrastructure more rules can be added in the future and further functionality can accumulate over time.**

### Project Structure

```
.
|- README.md
|- package.json (specifies dependencies and npm scripts)
|- yarn.lock (specifies dependencies if you want to use yarn instead)
|_ source
  |_ index.js (main module export point)
  |_ pricer.js (Pricer module)
  |_ subscriber.js (Subscriber class)
  |_ validate.js (Validator module)
|_ test
  |_ pricer.spec.js (Pricer tests)
  |_ subscriber.spec.js (Subscriber tests)
  |_ validate.spec.js (Validator tests)
|_ distribution (transpiled es5) 
  |_ index.js 
  |_ pricer.js 
  |_ subscriber.js 
  |_ validate.js 
```

### Design Decisions

1) The module was written to accept two JSON "schemas" to describe the input and the calculation of the output in order to enable the system to be able to be updated by simply editing the JSON objects.  JSON is supported in many languages on many platforms and could potentially be served from a remote database completely separate from the PG Coding Challenge Module allowing future scaling to involve the introduction of new implementations of the core functionality as well as automated adjustments to the JSON schemas.

2) Rudimentary type checking using ```typeof``` was implemented due to the author's lack of familiarity with the node ecosystem, in the future it would be valuable to replace the use of the ```typeof``` keyword with a more mature system.  Some sort of type checking was deemed necessary in this instance because the PG Code Challenge Module is dependent upon the notion that developers could specify pricing rules in JSON that would depend upon the correct inputs specified in a separate subscriber JSON file.

3) The Pricing schema is parsed in order from top to bottom (i.e, if you want the base cost to be added before everything else you include it at the top of the file).  A field specifying calculation order was considered however it was determined that this added complexibility and reduced readibility while at the same time slowing down the parsing of the pricing rules by several orders of magnitude.

4) Currently very few options beyond what is necessary for satisfying the spec are implemented in the Pricer module.  The idea is that because of the infrastructure more rules can be added in the future and further functionality can accumulate over time.
