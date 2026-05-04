export interface BaseProps {
  label?: string;
  error?: string;
  id: string;
}

export type InputProps = BaseProps & {
  tag?: "input";
  type?: "number" | "text";
  name?: string;
  ref?: React.Ref<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type TextareaProps = BaseProps & {
  tag?: "textarea";
  ref?: React.Ref<HTMLTextAreaElement>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type CheckBoxProps = BaseProps & {
  tag?: "checkbox";
  options?: string[];
  ref?: React.Ref<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type FormFieldProps = InputProps | TextareaProps | CheckBoxProps;
