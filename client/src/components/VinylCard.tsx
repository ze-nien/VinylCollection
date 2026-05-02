import type { Vinyl } from "../types/vinyl.ts";

const VinylCard = ({ vinyl }: { vinyl: Vinyl }) => {
  return (
    <div className="flex m-3">
      <ul>
        <li>{vinyl._id}</li>
        <li>{vinyl.album}</li>
        <li>{vinyl.artist}</li>
        <li>
          {vinyl.genre && vinyl.genre.length > 0
            ? vinyl.genre.map((g) => (
                <span
                  key={g}
                  className="m-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{g}
                </span>
              ))
            : "未分類"}
        </li>
      </ul>
    </div>
  );
};

export default VinylCard;
