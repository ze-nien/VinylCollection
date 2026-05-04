import { Link } from "react-router";
import type { Vinyl } from "../types/vinyl.ts";
import { useVinylStore } from "../store/vinylStore.ts";

const VinylCard = ({ vinyl }: { vinyl: Vinyl }) => {
  const deleteVinyl = useVinylStore((s) => s.deleteVinyl);
  return (
    <div className="flex m-3">
      <ul>
        <li>
          <Link to={`edit/${vinyl._id}`}>{vinyl._id}</Link>
        </li>
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
        <li>
          <button onClick={() => deleteVinyl(vinyl._id)}>delete</button>
        </li>
      </ul>
    </div>
  );
};

export default VinylCard;
