import type React from "react";
import type { BaseProps } from "../types/formField";

interface FieldWrapperProps extends BaseProps {
  children: React.ReactNode;
}

const FieldWrapper = ({ label, error, id, children }: FieldWrapperProps) => {
  return (
    <div className="relative flex flex-col m-2">
      <label htmlFor={id}>{label}: </label>
      {children}
      <div className="absolute right-0">
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    </div>
  );
};

export default FieldWrapper;
