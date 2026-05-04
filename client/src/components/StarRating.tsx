interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void; // 如果提供 onChange 則為編輯模式
  size?: number;
}

const StarRating = ({ value, onChange, size = 20 }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange?.(star)}
          className={`cursor-${onChange ? "pointer" : "default"} ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
          style={{ fontSize: size }}
        >
          ★
        </span>
      ))}
    </div>
  );
};
export default StarRating;
