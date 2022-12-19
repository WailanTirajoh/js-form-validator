# JS Form Validator

JS Form Validator is a simple form data validation library for JavaScript. It provides a set of base rules for checking the type and value of various inputs, and allows you to define custom rules as well.

## Installation

To install JS Form Validator, use one of the following package managers:

```
npm install --save js-form-validator
```

```
pnpm add js-form-validator
```

## Usage

To use JS Form Validator, import the Validator class and create a new instance, passing in an object with the following properties:

- formData: An object containing the form data to be validated.
- rules: An object specifying the validation rules for each field in the form data. (rules is not required to be pass as an parameter here)
  Here's an example of how to use JS Form Validator to validate a form with a required name field:

```
import { Validator } from "js-form-validator";

const formData = {
    name: null,
    deep: {
        neested: {
            object: {
                value: null
            }
        }
    },
    arrayObject: [
        {
            objectName: "object a name"
        },
        {
            objectName: null
        },
        {
            objectName: "object c name"
        },
    ]
};
const validator = new Validator({
  formData: formData,
  rules: {
    name: ["required"],
    "deep.nested.object.value": ["required"],
    "arrayObject.*.objectName": ["required"]
  },
});

// Validate the form data
await validator.validate();

// Check if the validation failed
if (validator.fail()) {
  // Get the validation error messages
  const error = validator.getErrorBag();
  console.log(error); // Output: {name: ["The field is required."], "deep.nested.object.value": ["The field is required."], "arrayObject.1.objectName": ["The field is required."]}
}
```

## Base Rules

JS Form Validator provides the following base rules for validating form data:

- required: checks if the value is undefined, an empty string, or null.
- array: checks if the value is an instance of the Array class.
- integer: checks if the value is an integer using the Number.isInteger() method.
- numeric: checks if the value is an instance of the Number class.
- string: checks if the value is a string.
- boolean: checks if the value is a boolean.
- allowed: checks if the value is included in a list of allowed values passed as arguments to the function.
- image: checks if the value is an instance of the File class, and also checks if the file's MIME type starts with "image/".
- size: checks if the value is an instance of the File class, and also checks if the file's size is within a specified range.

## Extends Custom Rules

JS Form Validator provides extendable custom rule to be runs alongside base rules, heres the code example:

```
const formData = {
    age: 25,
};
const validator = new Validator({
    formData: formData,
    rules: {
        age: ["custom"],
    },
}).mergeCustomRules({
    custom(value) {
        if (value === 25) {
            return "Test Error";
        }
    },
});

// Validate the form data
await validator.validate();

// Check if the validation failed
if (validator.fail()) {
  // Get the validation error messages
  const error = validator.getErrorBag();
  console.log(error);
}
```

### Function parameters

We can also parse parameters to the custom rules

```
const formData = {
  age: 25
};
const validator = new Validator({
  formData: formData,
  rules: {
    age: ["ageBetween:26,50"]
  },
})
validator.mergeCustomRules({
    ageBetween(value, paramA, paramB) {
        // paramA will be 25
        // paramB will be 50
        if (value < 26 || value > 50) {
            return `Age must be between ${paramA} - ${paramB}`;
        }
    },
});
```

### Anonymous Function

Or set anonymous function inside the array rules

```
const formData = {
  age: 25
};
const validator = new Validator({
  formData: formData,
  rules: {
    age: [
        (value) {
            const min = 26
            const max = 50
            if (value < min || value > max) {
                return `Age must be between ${min} - ${max}`;
            }
        }
    ]
  },
})
```

### Async / Await syntax

It can also use async / await syntax to fetch data and wait it to be fetched from some external source

```
const formData = {
  age: 25
};
const validator = new Validator({
  formData: formData,
  rules: {
    age: [
        async (value) {
            const { min, max } await fetch('/path/to/your/api');
            if (value < min || value > max) {
                return `Age must be between ${min} - ${max}`;
            }
        }
    ]
  },
})
```
