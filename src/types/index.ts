export interface FormConfig {
  onSubmit?: (formState: FormState) => void;
  onValidate?: (formState: FormState) => boolean;
}

export interface FieldConfig {
  [key: string]: TextFieldConfig | CheckboxFieldConfig | SelectFieldConfig;
}

export type FormOptions = Partial<{
  clearAfterSubmit: boolean;
  validationMode: "onChange" | "onSubmit";
}>;

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
    custom?: (value: string) => boolean;
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
  submitButton: {
    isDisabled: boolean;
    props: {
      type: "submit";
      disabled: boolean;
    };
  };
  form: {
    isValid: boolean;
    reset: () => void;
    props: {
      onSubmit?: () => void;
    };
  };
}

export interface InternalFields {
  [key: string]: FieldOutput;
}

export interface FieldOutput {
  inputProps: CheckboxInputProps | TextInputProps | SelectInputProps;
  value: boolean | string;
  isFocussed: boolean;
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
    isValid: boolean;
    isFocussed: boolean;
    isPristine: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isUntouched: boolean;
  };
}
