import type {
  InputProps,
  TextareaProps,
  CheckBoxProps,
  FormFieldProps,
} from "../types/formField";
import CheckBox from "./ui/CheckBox";
import FieldWrapper from "./FieldWrapper";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";

const FormField = (props: FormFieldProps) => {
  const { id, label, error, tag = "input" } = props;

  const renderElement = () => {
    switch (tag) {
      case "textarea": {
        //強制轉型
        //傳進來的props用as斷言是TextareaProps型別
        //將ref改名成textAreaRef 其餘參數塞進textAreaProps
        const {
          ref: textAreaRef,
          label: _l,
          error: _e,
          tag: _t,
          ...textAreaProps
        } = props as TextareaProps;
        return <TextArea ref={textAreaRef} {...textAreaProps} />;
      }

      case "checkbox": {
        const {
          options,
          label: _l,
          error: _e,
          tag: _t,
          ...checkboxProps
        } = props as CheckBoxProps;
        return <CheckBox options={options} {...checkboxProps} />;
      }

      case "input":
      default: {
        const {
          ref: inputRef,
          label: _l,
          error: _e,
          tag: _t,
          ...inputProps
        } = props as InputProps;
        return <Input ref={inputRef} {...inputProps} />;
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
