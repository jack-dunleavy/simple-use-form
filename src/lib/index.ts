import { FieldConfig, FormState } from "../types";
import { isInputElement, isSelectElement } from "../types/guards";

const getInitialStateForField = (field: string, fields: FieldConfig) => {
  const configType = fields[field].type;

  switch (configType) {
    case "checkbox":
      return {
        value: false,
        isUntouched: true,
        isTouched: false,
        isPristine: true,
        isDirty: false,
      };
    default:
      return {
        value: "",
        isUntouched: true,
        isTouched: false,
        isPristine: true,
        isDirty: false,
      };
  }
};

export const getInitialStateFromProps = (fields: FieldConfig) => {
  return Object.keys(fields).reduce((prev, curr) => {
    prev[curr] = getInitialStateForField(curr, fields);
    return prev;
  }, {});
};

export const getFieldValue = (
  field: string,
  fields: FieldConfig,
  stateValue: string | boolean
): { checked: boolean } | { value: string } => {
  const configType = fields[field].type;

  if (configType === "checkbox") {
    return {
      checked: stateValue as boolean,
    };
  }

  return {
    value: stateValue as string,
  };
};

export const getTypeValue = (
  field: string,
  fields: FieldConfig
): { type: "text" | "password" | "checkbox" } | {} => {
  if (fields[field].type === "select") {
    return {};
  }

  return {
    type: fields[field].type,
  };
};

export const getUpdatedFormState = (
  field: string,
  fields: FieldConfig,
  formState: FormState,
  changeEvent: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
): FormState => {
  const configType = fields[field].type;

  if (isInputElement(changeEvent.target) && configType === "checkbox") {
    // On checkbox change mark as dirty and touched since they ammount to the same thing
    return {
      ...formState,
      [field]: {
        ...formState[field],
        isDirty: true,
        isPristine: false,
        isTouched: true,
        isUntouched: false,
        value: changeEvent.target.checked,
      },
    };
  } else if (isSelectElement(changeEvent.target)) {
    return {
      [field]: {
        ...formState[field],
        isDirty: true,
        isPristine: false,
        isTouched: true,
        isUntouched: false,
        value: changeEvent.target.value,
      },
    };
  } else {
    // On text input change mark the field as dirty
    return {
      ...formState,
      [field]: {
        ...formState[field],
        isDirty: true,
        isPristine: false,
        value: changeEvent.target.value,
      },
    };
  }
};

// On text input blur mark the field as touched
export const markFieldAsTouched = (field: string, formState: FormState) => {
  return {
    ...formState,
    [field]: { ...formState[field], isTouched: true, isUntouched: false },
  };
};
