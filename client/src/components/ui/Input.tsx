import type { InputProps } from "../../types/formField";

const Input = ({ ref, id, valueAsNumber, ...inputProps }: InputProps) => {
  return (
    <input
      type={inputProps.type || "text"}
      id={id}
      ref={ref}
      {...inputProps}
      className="border p-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
};

export default Input;
