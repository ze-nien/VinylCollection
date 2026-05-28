import type { TextAreaElementProps } from "../../types/formField";

const TextArea = ({ id, ...textAreaProps }: TextAreaElementProps) => {
  return (
    <div>
      <div>
        <textarea
          {...textAreaProps}
          name={id}
          className="text-secondary h-18 resize-none w-full border p-1 rounded focus:ring-primary break-all"
        />
      </div>
      <div className="flex justify-end items-center mt-0.5 text-xs text-gray-400"></div>
    </div>
  );
};

export default TextArea;
