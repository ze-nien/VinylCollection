import type { CheckBoxElementProps } from "../../types/formField";

const CheckBox = ({ options, ...checkboxProps }: CheckBoxElementProps) => {
  return (
    <div className="grid grid-cols-5 grid-rows-4 gap-2 mt-1">
      {options?.map((opt) => {
        return (
          <label key={opt} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              value={opt}
              {...checkboxProps}
              className="size-4 rounded border-gray-300 text-primary focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary"
            />
            <span className="text-primary text-sm">{opt}</span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckBox;
