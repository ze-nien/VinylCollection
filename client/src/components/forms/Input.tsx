import type { InputElementProps } from "../../types/formField";

const Input = ({ ...inputProps }: InputElementProps) => {
  return (
    <input
      {...inputProps}
      className="text-secondary border p-1 rounded focus:ring-primary"
    />
  );
};

export default Input;
