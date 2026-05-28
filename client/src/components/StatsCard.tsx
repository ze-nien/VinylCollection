export const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="bg-primary text-secondary p-4 rounded-2xl">
    <p className="text-lg font-medium">{title}</p>
    <p className="text-4xl font-extrabold mt-2">{value}</p>
  </div>
);
