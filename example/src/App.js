import React from "react";

import { useForm } from "simple-use-form";

const fieldConfiguration = {
  lengthField: {
    type: "input",
    validation: {
      minLength: 1,
      maxLength: 4,
    },
  },
  regexField: {
    type: "input",
    validation: {
      regexp: /[a-z]+/,
    },
  },
  numbericalField: {
    type: "input",
    validation: {
      isNumeric: true,
    },
  },
  selectField: {
    type: "select",
  },
  checkboxField: {
    type: "checkbox",
  },
};

const App = () => {
  const { fields, isValid, clear } = useForm(fieldConfiguration);

  return (
    <div>
      <h1>Form Example</h1>
      <form>
        <div>
          <label>Length Validated Field</label>
          <input {...fields.lengthField.inputProps} />
        </div>
        <div>
          <label>Regex Validated Field</label>
          <input {...fields.regexField.inputProps} />
        </div>
        <div>
          <label>Numeric Input Field</label>
          <input {...fields.numbericalField.inputProps} />
        </div>
        <div>
          <label>Checkbox field</label>
          <input {...fields.checkboxField.inputProps} />
        </div>
        <div>
          <label>Select Field</label>
          <select
            {...fields.selectField.inputProps}
            onChange={(e) => console.log(e.target)}
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="a">A</option>
            <option value="b">B</option>
          </select>
        </div>
      </form>
      <p>Form is valid?: {isValid}</p>
      <button onClick={() => clear()}></button>
      <p>Form State: {JSON.stringify(fields)}</p>
    </div>
  );
};
export default App;
