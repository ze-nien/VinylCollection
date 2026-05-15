interface SelectOption {
  label: string;
  value: number | string;
}

interface BaseSelectProps {
  name?: string;
  label?: string;
  value: number | string;
  options: SelectOption[];
  onChange: (e: string) => void;
}

const BaseSelect = ({
  name,
  label,
  value,
  options,
  onChange,
}: BaseSelectProps) => {
  return (
    <div className="flex items-center mt-2">
      <label htmlFor={name}>{label}</label>
      <select
        className="bg-primary md:bg-secondary border-none focus:ring-0 text-xs ml-1 py-1 pl-1"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={`pageLimit-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BaseSelect;
