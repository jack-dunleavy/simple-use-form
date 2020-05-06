import {
  FieldConfig,
  FormConfig,
  FormOptions,
  FormState,
  InternalFields,
} from "../types";
import { isInputElement } from "../types/guards";
import { isFieldValid } from "./validation";

const getInitialStateForField = (field: string, fields: FieldConfig) => {
  const configType = fields[field].type;
  const sharedFields = {
    isFocussed: false,
    isUntouched: true,
    isTouched: false,
    isPristine: true,
    isDirty: false,
  };

  switch (configType) {
    case "checkbox":
      return {
        ...sharedFields,
        value: false,
      };
    default:
      return {
        value: "",
        ...sharedFields,
        isValid: isFieldValid(field, fields, ""),
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
): { checked: boolean; value: string } | { value: string } => {
  const configType = fields[field].type;

  if (configType === "checkbox") {
    return {
      value: stateValue.toString(),
      checked: stateValue as boolean,
    };
  }

  return {
    value: stateValue as string,
  };
};

export const getUpdatedFormState = (
  field: string,
  fields: FieldConfig,
  formState: FormState,
  formOptions: FormOptions,
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
  } else {
    // On text input change mark the field as dirty
    return {
      ...formState,
      [field]: {
        ...formState[field],
        isDirty: true,
        isPristine: false,
        isValid:
          formOptions.validationMode === "onSubmit"
            ? formState[field].isValid
            : isFieldValid(field, fields, changeEvent.target.value),
        value: changeEvent.target.value,
      },
    };
  }
};

// On text input blur mark the field as touched
export const markFieldAsBlurred = (field: string, formState: FormState) => {
  return {
    ...formState,
    [field]: {
      ...formState[field],
      isFocussed: false,
      isTouched: true,
      isUntouched: false,
    },
  };
};

// On text input focus mark the field as focussed
export const markFieldAsFocussed = (field: string, formState: FormState) => {
  return {
    ...formState,
    [field]: { ...formState[field], isFocussed: true },
  };
};

export const getFieldMetadata = (field: string, formState: FormState) => {
  return {
    isValid: formState[field].isValid,
    isFocussed: formState[field].isFocussed,
    isUntouched: formState[field].isUntouched,
    isTouched: formState[field].isTouched,
    isPristine: formState[field].isPristine,
    isDirty: formState[field].isDirty,
  };
};

export const getSubmitHandler = (
  fields: InternalFields,
  fieldConfig: FieldConfig,
  formConfig: FormConfig,
  formOptions: FormOptions,
  formState: FormState,
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
) => {
  if (formConfig.onSubmit) {
    return {
      onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formOptions.validationMode === "onSubmit") {
          const { formIsValid, updatedFields } = validateForm(
            fields,
            fieldConfig
          );

          if (!formIsValid) {
            setFormState(updatedFields);
            return;
          }
        } else if (!isFormValid(fields)) {
          return;
        }

        if (formConfig.onValidate && !formConfig.onValidate!(formState)) {
          return;
        }

        formConfig.onSubmit!(formState);

        if (formOptions.clearAfterSubmit) {
          setFormState(getInitialStateFromProps(fieldConfig));
        }
      },
    };
  }

  return {};
};

export const isFormValid = (fields: InternalFields) => {
  return (
    Object.values(fields)
      .map((val) => val.isValid)
      .indexOf(false) === -1
  );
};

const validateForm = (
  fields: InternalFields,
  fieldConfig: FieldConfig
): { formIsValid: boolean; updatedFields: InternalFields } => {
  let formIsValid = true;

  for (let field in fields) {
    const fieldIsValid = isFieldValid(field, fieldConfig, fields[field].value);
    formIsValid = false;
    fields[field].isValid = fieldIsValid;
  }

  return {
    formIsValid,
    updatedFields: fields,
  };
};
