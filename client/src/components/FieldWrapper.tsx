import type React from "react";
import type { BaseProps } from "../types/formField";

interface FieldWrapperProps extends BaseProps {
  children: React.ReactNode;
}

const FieldWrapper = ({ label, error, id, children }: FieldWrapperProps) => {
  return (
    <div className="flex flex-col m-2">
      <div>
        <label htmlFor={id}>{label}: </label>
        {children}
        {error && (
          <span className="ml-3 text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    </div>
  );
};

export default FieldWrapper;
