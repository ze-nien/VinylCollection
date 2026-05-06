import type { CheckBoxElementProps } from "../../types/formField";

const CheckBox = ({ options, ...checkboxProps }: CheckBoxElementProps) => {
  return (
    <div className="grid grid-cols-5 grid-rows-4 gap-1 mt-1">
      {options?.map((opt) => {
        return (
          <label
            key={opt}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={opt}
              {...checkboxProps}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckBox;
