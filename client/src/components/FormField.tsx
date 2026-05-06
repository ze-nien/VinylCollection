import type { FormFieldProps } from "../types/formField";
import CheckBox from "./ui/CheckBox";
import FieldWrapper from "./FieldWrapper";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";

const FormField = (props: FormFieldProps) => {
  const { id, label, error, tag } = props;

  const renderElement = () => {
    switch (tag) {
      case "textarea": {
        const { label, error, tag, ...textareaProps } = props;
        return <TextArea {...textareaProps} />;
      }
      case "checkbox": {
        const { label, error, tag, options, ...checkboxProps } = props;
        return <CheckBox {...checkboxProps} options={options} />;
      }
      case "input":
      default: {
        const { label, error, tag, ...inputProps } = props;
        return <Input {...inputProps} />;
      }
    }
  };

  return (
    <FieldWrapper label={label} error={error} id={id}>
      {renderElement()}
    </FieldWrapper>
  );
};

export default FormField;
