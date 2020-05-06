import { act, renderHook } from "@testing-library/react-hooks";
import { ChangeEvent } from "react";
import { useForm } from "./";
import { FieldConfig } from "./types";

describe("The useForm hook", () => {
  describe("The returned inputProps", () => {
    describe("For inputs of type 'text'", () => {
      it("should return the correct fields", () => {
        const { result } = renderHook(() => useForm(getFormConfig("text")));

        expect(result.current.fields).toMatchObject({
          testField: {
            inputProps: {
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
        const { result } = renderHook(() => useForm(getFormConfig("password")));

        expect(result.current.fields).toMatchObject({
          testField: {
            inputProps: {
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
            inputProps: {
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
          result.current.fields.testField.inputProps.onBlur
        ).not.toBeDefined();
        expect(
          result.current.fields.testField.inputProps.onFocus
        ).not.toBeDefined();
      });
    });

    describe("For 'select' elements", () => {
      it("should return the correct fields", () => {
        const { result } = renderHook(() =>
          useForm({
            testField: {
              type: "select",
            },
          })
        );

        expect(result.current.fields).toMatchObject({
          testField: {
            inputProps: {
              value: "",
              onChange: expect.any(Function),
            },
            isTouched: false,
            isUntouched: true,
            isPristine: true,
            isDirty: false,
          },
        });

        expect(
          result.current.fields.testField.inputProps.onBlur
        ).not.toBeDefined();
        expect(
          result.current.fields.testField.inputProps.onFocus
        ).not.toBeDefined();
      });
    });
  });

  describe("The touched / dirty states", () => {
    describe("For inputs of type 'text'", () => {
      it("should mark the field as 'touched' on blur", () => {
        const { result } = renderHook(() => useForm(getFormConfig("text")));

        act(() => {
          result.current.fields.testField.inputProps.onBlur();
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
          result.current.fields.testField.inputProps.onChange({
            target: { checked: true, nodeName: "INPUT" },
          } as ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.fields.testField.isTouched).toBe(true);
        expect(result.current.fields.testField.isDirty).toBe(true);
        expect(result.current.fields.testField.isUntouched).toBe(false);
        expect(result.current.fields.testField.isPristine).toBe(false);
      });
    });

    describe("For 'select' elements", () => {
      it("should mark the field as 'touched' and 'dirty' onChange", () => {
        const { result } = renderHook(() =>
          useForm({
            testField: {
              type: "select",
            },
          })
        );

        sendSelectChangeEvent(result, "testField", "selected value");

        expect(result.current.fields.testField.isTouched).toBe(true);
        expect(result.current.fields.testField.isDirty).toBe(true);
        expect(result.current.fields.testField.isUntouched).toBe(false);
        expect(result.current.fields.testField.isPristine).toBe(false);
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

/**
 * Helper function for updating text input
 */
const sendInputChangeEvent = (
  result: any,
  fieldName: string,
  newValue: string
) => {
  act(() => {
    result.current.fields[fieldName].inputProps.onChange({
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
    result.current.fields[fieldName].inputProps.onChange({
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
