import React from "react";

interface BaseProps {
  label: string;
  error?: string;
}

type InputProps = {
  tag?: "input";
} & React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  };
type TextareaProps = {
  tag?: "textarea";
} & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: React.Ref<HTMLTextAreaElement>;
  };

interface Options {
  label: string;
  value: string;
}

type CheckBoxProps = {
  tag?: "checkbox";
  options?: Options[];
} & React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  };

type FormFieldProps = BaseProps & (InputProps | TextareaProps | CheckBoxProps);

// type SelectProps = {
//   tag?: "select";
//   options?: Options[];
// } & React.SelectHTMLAttributes<HTMLSelectElement> & {
//     ref?: React.Ref<HTMLSelectElement>;
//   };
// interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   error?: string;
//   ref?: React.Ref<HTMLInputElement>;
// }

const FormField = (props: FormFieldProps) => {
  const { label, error, tag = "input" } = props;

  const renderElement = () => {
    switch (tag) {
      case "textarea": {
        //強制轉型
        //傳進來的props用as斷言是TextareaProps型別
        //將ref改名成txtRef 其餘參數塞進txtProps
        const { ref: txtRef, ...txtProps } = props as TextareaProps;
        return (
          <textarea ref={txtRef} {...txtProps} className="border p-1 rounded" />
        );
      }

      //   case "select": {
      //     const { ref: selRef, options, ...selProps } = props as SelectProps;
      //     return (
      //       <select ref={selRef} {...selProps} className="border p-1 rounded">
      //         <option value="">請選擇</option>
      //         {options?.map((opt) => (
      //           <option key={opt.value} value={opt.value}>
      //             {opt.label}
      //           </option>
      //         ))}
      //       </select>
      //     );
      //   }

      case "checkbox": {
        const { options, ...cheProps } = props as CheckBoxProps;
        return (
          <div className="flex flex-wrap gap-4 mt-2">
            {options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  {...cheProps}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        );
      }

      case "input":
      default: {
        const { ref: inputRef, ...inputProps } = props as InputProps;
        return (
          <input
            ref={inputRef}
            {...inputProps}
            className="border p-1 rounded"
          />
        );
      }
    }
  };

  return (
    <div>
      <label htmlFor={label}>{label}: </label>
      {renderElement()}
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
};

export default FormField;
