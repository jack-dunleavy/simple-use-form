export interface FieldConfig {
  [key: string]: TextFieldConfig | CheckboxFieldConfig | SelectFieldConfig;
}

export type TestingConfigUnion =
  | TextFieldConfig
  | CheckboxFieldConfig
  | SelectFieldConfig;

export interface TextFieldConfig {
  type: "text" | "password";
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regexp?: RegExp;
    isNumeric?: boolean;
  };
}

export interface CheckboxFieldConfig {
  type: "checkbox";
  validation?: {};
}

export interface SelectFieldConfig {
  type: "select";
  validation?: {
    required?: boolean;
  };
}

export interface FormOutput<T extends FieldConfig> {
  fields: { [key in keyof T]: FieldOutput };
}

export interface FieldOutput {
  inputProps: CheckboxInputProps | TextInputProps | SelectInputProps;
  isValid: boolean;
  isPristine: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isUntouched: boolean;
}

interface BaseInputProps {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface CheckboxInputProps extends BaseInputProps {
  checked: boolean;
}

interface TextInputProps extends BaseInputProps {
  type: string;
  value: string;
}

interface SelectInputProps extends BaseInputProps {
  value: string;
}

export interface FormState {
  [key: string]: {
    value: string | boolean;
    isPristine: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isUntouched: boolean;
  };
}
