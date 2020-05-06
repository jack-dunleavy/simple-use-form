import * as React from "react";
import {
  getFieldMetadata,
  getFieldValue,
  getInitialStateFromProps,
  getSubmitHandler,
  getTypeValue,
  getUpdatedFormState,
  isFormValid,
  markFieldAsBlurred,
  markFieldAsFocussed,
} from "./lib";
import {
  FieldConfig,
  FieldOutput,
  FormConfig,
  FormOptions,
  FormOutput,
  FormState,
} from "./types";

const setProperty = <T, K extends keyof T>(obj: T, key: K, value: T[K]) => {
  obj[key] = value;
};

export const useForm = <T extends FieldConfig>(
  fieldConfig: T,
  formConfig: FormConfig = {},
  formOptions: FormOptions = {}
): FormOutput<T> => {
  const [formState, setFormState] = React.useState<FormState>(
    getInitialStateFromProps(fieldConfig)
  );

  const getFocusHandlers = React.useCallback(
    (fieldName: string) => {
      if (
        fieldConfig[fieldName].type === "select" ||
        fieldConfig[fieldName].type === "checkbox"
      ) {
        return {};
      }

      return {
        onBlur: () => setFormState(markFieldAsBlurred(fieldName, formState)),
        onFocus: () => setFormState(markFieldAsFocussed(fieldName, formState)),
      };
    },
    [formState, fieldConfig]
  );

  const fields = {} as { [key in keyof T]: FieldOutput };

  for (let fieldName in fieldConfig) {
    setProperty(fields, fieldName, {
      inputProps: {
        ...getTypeValue(fieldName, fieldConfig),
        ...getFieldValue(fieldName, fieldConfig, formState[fieldName].value),
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) =>
          setFormState(
            getUpdatedFormState(
              fieldName,
              fieldConfig,
              formState,
              formOptions,
              e
            )
          ),
        ...getFocusHandlers(fieldName),
      },
      ...getFieldMetadata(fieldName, formState),
    });
  }

  return {
    fields,
    form: {
      isValid: isFormValid(fields),
      reset: () => setFormState(getInitialStateFromProps(fieldConfig)),
      props: {
        ...getSubmitHandler(
          fields,
          fieldConfig,
          formConfig,
          formOptions,
          formState,
          setFormState
        ),
      },
    },
    submitButton: {
      props: {
        type: "submit",
        disabled: !isFormValid(fields),
      },
      isDisabled: !isFormValid(fields),
    },
  };
};
