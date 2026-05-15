interface RadioOptions {
  label: string;
  value: string;
}

interface BaseRadioProps {
  className: string;
  name: string;
  value: string;
  options: RadioOptions[];
  onChange: (value: string) => void;
}

const BaseRadio = ({
  className,
  name,
  value,
  options,
  onChange,
}: BaseRadioProps) => {
  return (
    <div className={className}>
      {options.map((option) => {
        const uniqueId = `${name}-${option.value}`;
        return (
          <label
            htmlFor={uniqueId}
            key={option.value}
            className="flex items-center gap-1"
          >
            <input
              type="radio"
              name={name}
              id={uniqueId}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="text-secondary focus:ring-0 focus:ring-offset-0 md:checked:text-primary"
            />
            <div className="hover:cursor-pointer hover:text-white transition">
              {option.label}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default BaseRadio;
