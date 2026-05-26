import type React from "react";
import type { BaseProps } from "../types/formField";

interface FieldWrapperProps extends BaseProps {
  children: React.ReactNode;
}

const FieldWrapper = ({ label, error, id, children }: FieldWrapperProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <label htmlFor={id}>{label}: </label>
        {error && (
          <span className="text-xs text-red-400 font-medium">{error}</span>
        )}
      </div>
      {children}
    </div>
  );
};

export default FieldWrapper;
