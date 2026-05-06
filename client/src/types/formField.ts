import type { ComponentPropsWithRef } from "react";

export type InputElementProps = ComponentPropsWithRef<"input">;
export type TextAreaElementProps = ComponentPropsWithRef<"textarea">;
export type CheckBoxElementProps = {
  options?: string[];
} & Omit<ComponentPropsWithRef<"input">, "type">;

export interface BaseProps {
  label: string;
  error?: string;
  id: string;
}
export type FormFieldInputProps = BaseProps & {
  tag: "input";
} & ComponentPropsWithRef<"input">;
export type FormFieldTextareaProps = BaseProps & {
  tag: "textarea";
} & ComponentPropsWithRef<"textarea">;
export type FormFieldCheckBoxProps = BaseProps & {
  tag: "checkbox";
  options?: string[];
} & Omit<ComponentPropsWithRef<"input">, "type">;
export type FormFieldProps =
  | FormFieldInputProps
  | FormFieldTextareaProps
  | FormFieldCheckBoxProps;
