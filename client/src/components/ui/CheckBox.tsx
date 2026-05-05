import type { CheckBoxProps } from "../../types/formField";

const CheckBox = ({ options, ...checkboxProps }: CheckBoxProps) => {
  return (
    <div className="flex flex-wrap gap-4 mt-2">
      {options?.map((opt) => {
        return (
          <label
            key={opt}
            className="flex items-center gap-2 cursor-pointer group"
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
