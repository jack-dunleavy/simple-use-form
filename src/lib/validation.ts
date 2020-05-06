import { FieldConfig } from "../types";
import { isSelectFieldConfig, isTextFieldConfig } from "../types/guards";

export const isFieldValid = (
  field: string,
  fieldConfig: FieldConfig,
  stateValue: string | boolean
) => {
  // Checkboxes cannot be invalid
  if (typeof stateValue === "boolean") {
    return true;
  }

  const config = fieldConfig[field];

  // Text Input validation
  if (isTextFieldConfig(config)) {
    const validators = config.validation;

    if (!validators) {
      return true;
    }

    if (validators.required && stateValue.length === 0) {
      return false;
    }

    if (validators.minLength && stateValue.length < validators.minLength) {
      return false;
    }

    if (validators.maxLength && stateValue.length > validators.maxLength) {
      return false;
    }

    if (validators.regexp && !validators.regexp.test(stateValue)) {
      return false;
    }

    if (validators.isNumeric && isNaN(Number(stateValue))) {
      return false;
    }

    if (validators.custom && !validators.custom(stateValue)) {
      return false;
    }
  }

  if (isSelectFieldConfig(config)) {
    const validators = config.validation;

    if (!validators) {
      return true;
    }

    if (validators.required && stateValue === "") {
      return false;
    }
  }

  // Default to valid
  return true;
};
