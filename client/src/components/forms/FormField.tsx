import type { FormFieldProps } from "../../types/formField";
import CheckBox from "./CheckBox";
import FieldWrapper from "./FieldWrapper";
import Input from "./Input";
import TextArea from "./TextArea";

const RenderElement = (props: FormFieldProps) => {
  switch (props.tag) {
    case "textarea": {
      const { label: _, error: __, tag: ___, ...textareaProps } = props;
      return <TextArea {...textareaProps} />;
    }
    case "checkbox": {
      const {
        label: _,
        error: __,
        tag: ___,
        options,
        ...checkboxProps
      } = props;
      return <CheckBox {...checkboxProps} options={options} />;
    }
    case "input":
    default: {
      const { label: _, error: __, tag: ___, ...inputProps } = props;
      return <Input {...inputProps} />;
    }
  }
};

const FormField = (props: FormFieldProps) => {
  const { id, label, error } = props;
  return (
    <FieldWrapper label={label} error={error} id={id}>
      <RenderElement {...props} />
    </FieldWrapper>
  );
};

export default FormField;
