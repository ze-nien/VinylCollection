import type { TextareaProps } from "../../types/formField";

const TextArea = ({ ref, ...textAreaProps }: TextareaProps) => {
  return (
    <div>
      <textarea ref={ref} {...textAreaProps} className="border p-1 rounded" />
    </div>
  );
};

export default TextArea;
