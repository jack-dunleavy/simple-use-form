import * as React from "react";
import {
  getFieldValue,
  getInitialStateFromProps,
  getTypeValue,
  getUpdatedFormState,
  markFieldAsTouched,
} from "./lib";
import { isFieldValid } from "./lib/validation";
import { FieldConfig, FieldOutput, FormOutput, FormState } from "./types";

const setProperty = <T, K extends keyof T>(obj: T, key: K, value: T[K]) => {
  obj[key] = value;
};

export const useForm = <T extends FieldConfig>(
  fieldConfig: T
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
        onBlur: () => setFormState(markFieldAsTouched(fieldName, formState)),
        onFocus: () => {},
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
            getUpdatedFormState(fieldName, fieldConfig, formState, e)
          ),
        ...getFocusHandlers(fieldName),
      },
      isValid: isFieldValid(fieldName, fieldConfig, formState[fieldName].value),
      isUntouched: formState[fieldName].isUntouched,
      isTouched: formState[fieldName].isTouched,
      isPristine: formState[fieldName].isPristine,
      isDirty: formState[fieldName].isDirty,
    });
  }

  return {
    fields,
  };
};
