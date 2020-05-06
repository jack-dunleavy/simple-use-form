import { act, renderHook } from "@testing-library/react-hooks";
import { ChangeEvent } from "react";
import useForm from "./";
import { FieldConfig } from "./types";

describe("The useForm hook", () => {
  describe("The field level outputs", () => {
    describe("The returned props", () => {
      describe("For inputs of type 'text'", () => {
        it("should return the correct fields", () => {
          const { result } = renderHook(() => useForm(getFormConfig("text")));

          expect(result.current.fields).toMatchObject({
            testField: {
              props: {
                value: "",
                onChange: expect.any(Function),
                onBlur: expect.any(Function),
                onFocus: expect.any(Function),
                type: "text",
              },
              isTouched: false,
              isUntouched: true,
              isPristine: true,
              isDirty: false,
            },
          });
        });
      });

      describe("For inputs of type 'password'", () => {
        it("should return the correct fields", () => {
          const { result } = renderHook(() =>
            useForm(getFormConfig("password"))
          );

          expect(result.current.fields).toMatchObject({
            testField: {
              props: {
                value: "",
                onChange: expect.any(Function),
                onBlur: expect.any(Function),
                onFocus: expect.any(Function),
                type: "password",
              },
              isTouched: false,
              isUntouched: true,
              isPristine: true,
              isDirty: false,
            },
          });
        });
      });

      describe("For inputs of type 'checkbox", () => {
        it("should return the correct fields", () => {
          const { result } = renderHook(() =>
            useForm({
              testField: {
                type: "checkbox",
              },
            })
          );

          expect(result.current.fields).toMatchObject({
            testField: {
              props: {
                onChange: expect.any(Function),
                type: "checkbox",
                checked: false,
              },
              isTouched: false,
              isUntouched: true,
              isPristine: true,
              isDirty: false,
            },
          });

          expect(
            result.current.fields.testField.props.onBlur
          ).not.toBeDefined();
          expect(
            result.current.fields.testField.props.onFocus
          ).not.toBeDefined();
        });
      });
    });

    describe("The touched / dirty states", () => {
      describe("For inputs of type 'text'", () => {
        it("should mark the field as 'touched' on blur", () => {
          const { result } = renderHook(() => useForm(getFormConfig("text")));

          act(() => {
            result.current.fields.testField.props.onBlur!();
          });

          expect(result.current.fields.testField.isTouched).toBe(true);
          expect(result.current.fields.testField.isUntouched).toBe(false);
        });

        it("should mark the field as dirty onChange", () => {
          const { result } = renderHook(() => useForm(getFormConfig("text")));

          sendInputChangeEvent(result, "testField", "dirty field");

          expect(result.current.fields.testField.isPristine).toBe(false);
          expect(result.current.fields.testField.isDirty).toBe(true);
        });
      });

      describe("For inputs of type 'checkbox'", () => {
        it("should mark the field as 'touched' and 'dirty' onChange", () => {
          const { result } = renderHook(() =>
            useForm({
              testField: {
                type: "checkbox",
              },
            })
          );

          act(() => {
            result.current.fields.testField.props.onChange({
              target: { checked: true, nodeName: "INPUT" },
            } as ChangeEvent<HTMLInputElement>);
          });

          expect(result.current.fields.testField.isTouched).toBe(true);
          expect(result.current.fields.testField.isDirty).toBe(true);
          expect(result.current.fields.testField.isUntouched).toBe(false);
          expect(result.current.fields.testField.isPristine).toBe(false);
        });
      });
    });

    describe("The focused / unfocused states", () => {
      describe("For inputs of type 'text'", () => {
        it("should toggle whether the field is 'focussed' on focus and blur", () => {
          const { result } = renderHook(() => useForm(getFormConfig("text")));

          expect(result.current.fields.testField.isFocussed).toBe(false);

          act(() => {
            result.current.fields.testField.props.onFocus!();
          });

          expect(result.current.fields.testField.isFocussed).toBe(true);

          act(() => {
            result.current.fields.testField.props.onBlur!();
          });

          expect(result.current.fields.testField.isFocussed).toBe(false);
        });
      });
    });

    describe("When validation is provided", () => {
      describe("For inputs of type 'text'", () => {
        it("should validate against min and max length", () => {
          const { result } = renderHook(() =>
            useForm(
              getFormConfig("text", {
                minLength: 1,
                maxLength: 10,
              })
            )
          );

          expect(result.current.fields.testField.isValid).toBe(false);

          sendInputChangeEvent(result, "testField", "correct");

          expect(result.current.fields.testField.isValid).toBe(true);

          sendInputChangeEvent(result, "testField", "over max length text");

          expect(result.current.fields.testField.isValid).toBe(false);
        });

        it("should validate against the provided regexp", () => {
          const { result } = renderHook(() =>
            useForm(
              getFormConfig("text", {
                regexp: /specific\ [A-Z]+/,
              })
            )
          );

          expect(result.current.fields.testField.isValid).toBe(false);

          sendInputChangeEvent(result, "testField", "not a match");

          expect(result.current.fields.testField.isValid).toBe(false);

          sendInputChangeEvent(result, "testField", "specific MATCH");

          expect(result.current.fields.testField.isValid).toBe(true);
        });

        it("should validate the field is not empty", () => {
          const { result } = renderHook(() =>
            useForm(
              getFormConfig("text", {
                required: true,
              })
            )
          );

          expect(result.current.fields.testField.isValid).toBe(false);

          sendInputChangeEvent(result, "testField", "not empty");

          expect(result.current.fields.testField.isValid).toBe(true);
        });

        it("should validate the field is numeric", () => {
          const { result } = renderHook(() =>
            useForm(getFormConfig("text", { isNumeric: true }))
          );

          expect(result.current.fields.testField.isValid).toBe(true);

          sendInputChangeEvent(result, "testField", "not a number");

          expect(result.current.fields.testField.isValid).toBe(false);

          sendInputChangeEvent(result, "testField", "123");

          expect(result.current.fields.testField.isValid).toBe(true);
        });

        it("should validate using the custom validator", () => {
          const customValidator = jest
            .fn()
            .mockImplementation((value: string) => value === "valid");
          const { result } = renderHook(() =>
            useForm(getFormConfig("text", { custom: customValidator }))
          );

          expect(result.current.fields.testField.isValid).toBe(false);

          sendInputChangeEvent(result, "testField", "valid");

          expect(result.current.fields.testField.isValid).toBe(true);

          sendInputChangeEvent(result, "testField", "invalid");

          expect(result.current.fields.testField.isValid).toBe(false);
        });
      });

      describe("For inputs of type 'password'", () => {
        it("should validate against min and max length", () => {
          const { result } = renderHook(() =>
            useForm(
              getFormConfig("password", {
                minLength: 1,
                maxLength: 10,
              })
            )
          );

          expect(result.current.fields.testField.isValid).toBe(false);

          sendInputChangeEvent(result, "testField", "correct");

          expect(result.current.fields.testField.isValid).toBe(true);

          sendInputChangeEvent(result, "testField", "over max length text");

          expect(result.current.fields.testField.isValid).toBe(false);
        });
      });

      describe('For "select" elements', () => {
        it("should validate the field is not an empty string", () => {
          const { result } = renderHook(() =>
            useForm({
              testField: {
                type: "select",
                validation: {
                  required: true,
                  minLength: 1,
                },
              },
            })
          );

          expect(result.current.fields.testField.isValid).toBe(false);

          sendSelectChangeEvent(result, "testField", "");

          expect(result.current.fields.testField.isValid).toBe(false);

          sendSelectChangeEvent(result, "testField", "selected");

          expect(result.current.fields.testField.isValid).toBe(true);
        });
      });
    });
  });

  describe("The form level outputs", () => {
    describe("The isValid flag", () => {
      it("should mark the form as invalid when the only field is invalid", () => {
        const { result } = renderHook(() =>
          useForm(
            getFormConfig("text", {
              required: true,
            })
          )
        );

        expect(result.current.form.isValid).toBe(false);

        sendInputChangeEvent(result, "testField", "valid field");

        expect(result.current.form.isValid).toBe(true);
      });

      it("should mark the form as invalid when the any of the fields are invalid", () => {
        const { result } = renderHook(() =>
          useForm({
            validField: {
              type: "text",
            },
            invalidField: {
              type: "text",
              validation: {
                required: true,
              },
            },
          })
        );

        expect(result.current.form.isValid).toBe(false);

        sendInputChangeEvent(result, "invalidField", "valid field");

        expect(result.current.form.isValid).toBe(true);
      });

      it("should mark the form as valid when all fields are valid", () => {
        const { result } = renderHook(() => useForm(getFormConfig("text")));

        expect(result.current.form.isValid).toBe(true);
      });
    });

    describe("When a submission handler is provided", () => {
      it("should call the provided function with the form state when submitted", () => {
        const onSubmit = jest.fn();
        const { result } = renderHook(() =>
          useForm(
            {
              validField: {
                type: "text",
              },
            },
            { onSubmit }
          )
        );

        act(() => {
          result.current.form.props.onSubmit!();
        });

        expect(onSubmit).toHaveBeenCalledWith({
          validField: {
            value: "",
            isFocussed: false,
            isPristine: true,
            isDirty: false,
            isTouched: false,
            isValid: true,
            isUntouched: true,
          },
        });
      });

      it("should validate the form before submission", () => {
        const onSubmit = jest.fn();
        const { result } = renderHook(() =>
          useForm(
            {
              invalidField: {
                type: "text",
                validation: {
                  required: true,
                },
              },
            },
            { onSubmit }
          )
        );

        act(() => {
          result.current.form.props.onSubmit!();
        });

        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    describe("When a custom validator is provided", () => {
      it("should not submit if the custom validation fails", () => {
        const onSubmit = jest.fn();
        const onValidate = jest.fn().mockReturnValue(false);
        const { result } = renderHook(() =>
          useForm(
            {
              testField: {
                type: "text",
              },
            },
            { onSubmit, onValidate }
          )
        );

        act(() => {
          result.current.form.props.onSubmit!();
        });

        expect(onValidate).toHaveBeenCalledWith({
          testField: {
            value: "",
            isFocussed: false,
            isPristine: true,
            isDirty: false,
            isTouched: false,
            isValid: true,
            isUntouched: true,
          },
        });
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should submit if the custom validation is successful", () => {
        const onSubmit = jest.fn();
        const onValidate = jest.fn().mockReturnValue(true);
        const { result } = renderHook(() =>
          useForm(
            {
              testField: {
                type: "text",
              },
            },
            { onSubmit, onValidate }
          )
        );

        act(() => {
          result.current.form.props.onSubmit!();
        });

        expect(onSubmit).toHaveBeenCalledWith({
          testField: {
            value: "",
            isFocussed: false,
            isPristine: true,
            isDirty: false,
            isTouched: false,
            isValid: true,
            isUntouched: true,
          },
        });
      });
    });

    describe("The clear function", () => {
      it("should reset the forms state", () => {
        const { result } = renderHook(() => useForm(getFormConfig("text")));

        sendInputChangeEvent(result, "testField", "value");

        expect(result.current.fields.testField.value).toEqual("value");

        act(() => {
          result.current.form.reset();
        });

        expect(result.current.fields.testField.value).toEqual("");
      });
    });

    describe("The submitButton Output", () => {
      it("should enable when the form becomes invalid", () => {
        const { result } = renderHook(() =>
          useForm(
            getFormConfig("text", {
              required: true,
            })
          )
        );

        expect(result.current.submitButton.props).toEqual({
          disabled: true,
          type: "submit",
        });
        expect(result.current.submitButton.isDisabled).toEqual(true);

        sendInputChangeEvent(result, "testField", "value");
        expect(result.current.submitButton.props).toEqual({
          disabled: false,
          type: "submit",
        });
        expect(result.current.submitButton.isDisabled).toEqual(false);
      });
    });
  });

  describe("The configurable behaviours", () => {
    describe("Clear on Submission", () => {
      it("should clear the form when submitted", () => {
        const onSubmit = jest.fn();
        const { result } = renderHook(() =>
          useForm(
            getFormConfig("text"),
            { onSubmit },
            { clearAfterSubmit: true }
          )
        );

        sendInputChangeEvent(result, "testField", "value");

        act(() => {
          result.current.form.props.onSubmit!();
        });

        expect(result.current.fields.testField.value).toEqual("");
      });
      it("should not clear the form when submitted", () => {
        const onSubmit = jest.fn();
        const { result } = renderHook(() =>
          useForm(
            getFormConfig("text"),
            { onSubmit },
            { clearAfterSubmit: false }
          )
        );

        sendInputChangeEvent(result, "testField", "value");

        act(() => {
          result.current.form.props.onSubmit!();
        });

        expect(result.current.fields.testField.value).toEqual("value");
      });
    });

    describe("Validation mode", () => {
      it("should validate when values change (default)", () => {
        const { result } = renderHook(() =>
          useForm(
            getFormConfig("text", { required: true }),
            {},
            { validationMode: "onChange" }
          )
        );

        expect(result.current.fields.testField.isValid).toEqual(false);
        expect(result.current.form.isValid).toEqual(false);

        sendInputChangeEvent(result, "testField", "updated value");

        expect(result.current.fields.testField.isValid).toEqual(true);
        expect(result.current.form.isValid).toEqual(true);
      });

      it("should validate when the form is submitted", () => {
        const onSubmit = jest.fn();
        const { result } = renderHook(() =>
          useForm(
            getFormConfig("text", { required: true }),
            { onSubmit },
            { validationMode: "onSubmit" }
          )
        );

        expect(result.current.fields.testField.isValid).toEqual(false);
        expect(result.current.form.isValid).toEqual(false);

        sendInputChangeEvent(result, "testField", "updated value");

        expect(result.current.fields.testField.isValid).toEqual(false);
        expect(result.current.form.isValid).toEqual(false);

        act(() => {
          result.current.form.props.onSubmit!();
        });

        expect(onSubmit).not.toHaveBeenCalled();

        expect(result.current.fields.testField.isValid).toEqual(true);
        expect(result.current.form.isValid).toEqual(true);
      });
    });
  });
});

/**
 * Helper function for updating text input
 */
const sendInputChangeEvent = (
  result: any,
  fieldName: string,
  newValue: string
) => {
  act(() => {
    result.current.fields[fieldName].props.onChange({
      target: { value: newValue, nodeName: "INPUT" },
    } as ChangeEvent<HTMLInputElement>);
  });
};

/**
 * Helper function for updating select value
 */
const sendSelectChangeEvent = (
  result: any,
  fieldName: string,
  newValue: string
) => {
  act(() => {
    result.current.fields[fieldName].props.onChange({
      target: { value: newValue, nodeName: "SELECT" },
    } as ChangeEvent<HTMLInputElement>);
  });
};

/**
 * Helper function for creating the test form configuration
 */
const getFormConfig = (
  type: "text" | "checkbox" | "select" | "password",
  validation?: any
): FieldConfig => {
  const validationConfig = validation ? { validation } : {};

  return {
    testField: {
      type,
      ...validationConfig,
    },
  };
};
