import { useState, type ChangeEvent } from "react";
import type { TextAreaElementProps } from "../../types/formField";

const TextArea = ({
  id,
  maxLength = 100,
  onChange,
  defaultValue,
  ...textAreaProps
}: TextAreaElementProps) => {
  const [typedValue, setTypedValue] = useState<string | undefined>(undefined);
  const currentLength =
    typedValue !== undefined
      ? typedValue.length
      : defaultValue
        ? String(defaultValue).length
        : 0;

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTypedValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div>
      <div>
        <textarea
          {...textAreaProps}
          name={id}
          defaultValue={defaultValue}
          onChange={handleTextAreaChange}
          className="text-secondary h-18 resize-none w-full border p-1 rounded focus:ring-primary break-all"
        />
      </div>
      <div className="flex justify-end items-center mt-0.5 text-xs text-gray-400">
        <span
          className={
            currentLength > maxLength ? "text-red-400 font-medium" : ""
          }
        >
          {currentLength} / {maxLength}
        </span>
      </div>
    </div>
  );
};

export default TextArea;
