import type { InputElementProps } from "../../types/formField";

const Input = ({ ...inputProps }: InputElementProps) => {
  return (
    <input
      {...inputProps}
      className="border p-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
};

export default Input;
