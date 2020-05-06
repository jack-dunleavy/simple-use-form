import { CheckboxFieldConfig, SelectFieldConfig, TextFieldConfig } from ".";

export const isInputElement = (
  element: HTMLInputElement | HTMLSelectElement
): element is HTMLInputElement => {
  return element.nodeName === "INPUT";
};

export const isSelectElement = (
  element: HTMLInputElement | HTMLSelectElement
): element is HTMLSelectElement => {
  return element.nodeName === "SELECT";
};

export const isTextFieldConfig = (
  config: CheckboxFieldConfig | SelectFieldConfig | TextFieldConfig
): config is TextFieldConfig => {
  return config.type === "text" || config.type === "password";
};

export const isSelectFieldConfig = (
  config: CheckboxFieldConfig | SelectFieldConfig | TextFieldConfig
): config is TextFieldConfig => {
  return config.type === "select";
};
