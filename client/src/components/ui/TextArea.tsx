import type { TextAreaElementProps } from "../../types/formField";

const TextArea = ({ ...textAreaProps }: TextAreaElementProps) => {
  return (
    <div>
      <textarea {...textAreaProps} className="w-full border p-1 rounded" />
    </div>
  );
};

export default TextArea;
