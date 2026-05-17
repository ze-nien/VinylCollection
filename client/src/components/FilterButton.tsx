interface FilterButtonProps {
  options: readonly string[];
  activeValue: string | readonly string[];
  onClick: (value: string) => void;
  className?: string;
}

const BaseButton = ({
  options,
  activeValue,
  onClick,
  className,
}: FilterButtonProps) => {
  return (
    <div className={className}>
      {options.map((option) => {
        const isActive = Array.isArray(activeValue)
          ? activeValue.includes(option)
          : activeValue === option;
        return (
          <button
            type="button"
            key={option}
            onClick={() => onClick(option)}
            className={`text-xs py-0.5 rounded-md transition hover:cursor-pointer 
                              ${
                                isActive
                                  ? "bg-secondary text-primary md:bg-primary md:text-secondary" // 選中樣式
                                  : "hover:text-primary hover:bg-secondary md:hover:text-secondary md:hover:bg-primary" // 未選中樣式
                              }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default BaseButton;
