# simple-use-form

> Simple form state management for React forms

[![NPM](https://img.shields.io/npm/v/simple-use-form.svg)](https://www.npmjs.com/package/simple-use-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> ## Feature requests and Bug fixes
>
> I've had to create similar form management components on a number of personal and professional projects - I've open sourced the code in the hope that it will save you some time. Please feel free to open bugs and feature requests as issues in [git](https://github.com/jack-dunleavy/simple-use-form/issues)

## Install

```bash
yarn add simple-use-form
```

## Concepts

This module aims to reduce the boilerplate associated with creating and maintaining the state for components that use forms. It does so by presenting an easy to understand hook based interface which accepts configuration information about a 'form' and returns up-to-date information about that form.

> This module does not attempt to prescribe a particular style or appearance

Instead, the module provides a set of functions and values associated with the form, allowing you to attach it to any HTML and CSS implementation. One point to note is that the module is somewhat opinionated about which HTML tags and attributes should be used. This is done to encourage best practices when building cross browser, accessible applications. As such, you will find that the module works best when you use the idiomatic elements: `input`, `select`, `form`, etc. rather than styled `divs`.

## Usage

At the core of this module is the idea that most of the information about how a form should behave can, and should, be stored as configuration. The configuration is made up of three objects, dubbed: `FieldConfig`, `FormConfig`, and `FormOptions`. The specifics of these props are described in detail below.

The following example shows the configuration for a simple login form which uses a very simple regexp to catch invalid email addresses.

```tsx
import * as React from "react";

import { useForm } from "simple-use-form";

const fieldConfig = {
  email: {
    type: "text",
    validation: {
      minLength: 8,
      maxLength: 32,
      regexp: /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.]+$/,
    },
  },
  password: {
    type: "password",
    validation: {
      minLength: 8,
      maxLength: 32,
    },
  },
};

const Example = () => {
  const { fields, submitButton, form } = useForm(fieldConfig);

  return (
    <form {...form.props}>
      <div>
        <label>Email</label>
        <input {...fields.email.inputProps} />
      </div>

      <div>
        <label>Password</label>
        <input {...fields.password.inputProps} />
      </div>

      <button {...submitButton.props}>Submit</button>
    </form>
  );
};
```

### Form Submission

You can specify a function to call when the form is submitted (when the user clicks the submit button or hits 'Enter' while the form is focussed). If the form contains any errors the submit handler will not be called. If you wish to make fields optional simple omit the validation configuration from them and they will always be valid.

Extending the example above, we can add a simple submit handler to push the user's information. The on submit handler is passed the state of the form when it is executed.

> Note that the HTML markup for the form is unchanged - the behaviour is driven by the hook.

```diff
+ import logInUser from './user/login.ts'

const Example = () => {
-   const { fields, submitButton, form } = useForm(fieldConfig);
+   const { fields, submitButton, form } = useForm(fieldConfig, { onSubmit: (formState) => logInUser(formState.username.value, formState.password.value)});

  return (
    <form {...form.props}>
      <div>
        <label>Email</label>
        <input {...fields.email.inputProps} />
      </div>

      <div>
        <label>Password</label>
        <input {...fields.password.inputProps} />
      </div>

      <button {...submitButton.props}>Submit</button>
    </form>
  );
};
```

### Form Validation

The form is automatically validated according to the `FieldConfig` provided. If you would like to perform an additional validation step to validate more complicated relationships which cannot easily be expressed on a per-field basis, you can do so by providing an `onValidate` function. This will be executed when the form is submitted, after the in-built validation and before the `onSubmit` handler.

Extending our example above, we can add a validation function to ensure that the two fields are not identical

```diff
import logInUser from './user/login.ts'

+ const validateForm = (formState: FormState) => {
+   return formState.email !== formState.password
+ }

const Example = () => {
- const { fields, submitButton, form } = useForm(fieldConfig, { onSubmit: (formState) => logInUser(formState.username.value, formState.password.value)});
+ const { fields, submitButton, form } = useForm(fieldConfig, { onValidate: validateForm, onSubmit: (formState) => logInUser(formState.username.value, formState.password.value)});
  return (
    <form {...form.props}>
      <div>
        <label>Email</label>
        <input {...fields.email.inputProps} />
      </div>

      <div>
        <label>Password</label>
        <input {...fields.password.inputProps} />
      </div>

      <button {...submitButton.props}>Submit</button>
    </form>
  );
};

```

### Custom validation of a field

If the in-built validation functions are unable to capture your intended form validation behaviour you can create custom field validators. Extending once again the login example we can relax the validation behaviour for the username when it is equal to `admin`. Note that these are somewhat contrived examples and in a real app I probably wouldn't recommend this kind of split validation.

```diff
import * as React from "react";

import { useForm } from "simple-use-form";

const fieldConfig = {
  email: {
    type: "text",
    validation: {
      minLength: 5,
      maxLength: 32,
-     regexp: /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.]+$/,
+     custom: (value: string) => {
+       return /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.]+$/.test(value) || value === 'admin'
+     }
    },
  },
  password: {
    type: "password",
    validation: {
      minLength: 8,
      maxLength: 32,
    },
  },
};
```

### API

```tsx
const output = useForm(fieldConfig, formConfig, formOptions);
```

**Field Config:**

Consists of a set of key: value pairs where the key is the identifier for the form element. In the above examples we declare two form elements: `email` and `password`. Each field accepts a `type` value and an optional set of validators via the `validation` key. The options are detailed below:

| Field Type | Available Validators                           |
| ---------- | ---------------------------------------------- |
| `text`     | required, minLength, maxLength, regexp, custom |
| `password` | required, minLength, maxLength, regexp, custom |
| `select`   | required                                       |
| `checkbox` | required                                       |

**Validators**

| Validator | Type                       | Description                                                | Example                                        |
| --------- | -------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| required  | `boolean`                  | Ensures the value is truthy                                | `{ required: true }`                           |
| minLength | `number`                   | Ensures the value is longer than the provided number       | `{ minLength: 5 }`                             |
| maxLength | `number`                   | Ensures the value is shorter than the provided number      | `{ maxLength: 10 }`                            |
| regexp    | `RegExp`                   | Ensures the value matches the provided regular expression  | `{ regexp: /[a-z]+/ }`                         |
| custom    | `(val: string) => boolean` | Evaluates the function to determine whether value is valid | `{ custom: (value) => value.startsWith('A') }` |

**Form Config:**

| Parameter    | Type                             | Description                                                    |
| ------------ | -------------------------------- | -------------------------------------------------------------- |
| `onSubmit`   | `(formState: FormState) => void` | Pass the current form state to the provided submit handler     |
| `onValidate` | `(formState: FormState) => void` | Pass the current form state to the provided validation handler |

> The order of events is: `in-built validation of each field` => `custom validation of each specified field` => `in-build validation of form` => `custom validation of form` => `submission of form`

**Form Options:**

Additional configuration of the forms behaviour can be achieved by specifying form options. The following options are available

| Option           | Type                         | Default      | Description                                                                                                                                     |
| ---------------- | ---------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| clearAfterSubmit | `boolean`                    | `true`       | Clear the form state after submission                                                                                                           |
| validationMode   | `"onChange"` \| `"onSubmit"` | `"onChange"` | Set to onSubmit to avoid validating the fields and form after every change event (useful for forms with complicated or asynchronous validation) |

**Form State**

The form state is passed to custom form functions. The form state contains a key: value pair for each controlled field. Each field contains the following information:

```tsx
{
  value: string | boolean, // Current field value
  isValid: boolean, // Whether field passed validation
  isFocussed: boolean, // Whether the field currently has focus
  isPristine: boolean, // False if the field has been changed
  isDirty: boolean, // True if the field has been changed
  isTouched: boolean, // True if the field has been blurred
  isUntouched: boolean, // False if the field has been blurred
}
```

**Hook Output**

The return value of the hook contains the following information:

```tsx
{
  fields: {
    inputProps: Object, // Props to spread into the controlled input field
    value: boolean | string,
    isFocussed: boolean,
    isValid: boolean,
    isPristine: boolean,
    isDirty: boolean,
    isTouched: boolean,
    isUntouched: boolean,
  },
  submitButton: {
    isDisabled: boolean, // Whether the submit is currently disabled (maps to form.isValid)
    props: Object, // Props to spread into the form submit button
  },
  form: {
    isValid: boolean, // Whether the form is currently valid (maps to submitButton.isDisabled)
    reset: () => void,
    props: Object, // Props to spread into the form element
  },
}

```

## License

MIT © [jack-dunleavy](https://github.com/jack-dunleavy)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
