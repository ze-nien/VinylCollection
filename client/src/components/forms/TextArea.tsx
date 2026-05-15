import type { TextAreaElementProps } from "../../types/formField";

const TextArea = ({ ...textAreaProps }: TextAreaElementProps) => {
  return (
    <div>
      <textarea
        {...textAreaProps}
        className="text-secondary h-18 resize-none w-full border p-1 rounded focus:ring-primary"
      />
    </div>
  );
};

export default TextArea;
