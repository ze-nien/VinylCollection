import { Link } from "react-router";
import type { Vinyl } from "../types/vinyl.ts";
import { useVinylStore } from "../store/vinylStore.ts";

const VinylCard = ({ vinyl }: { vinyl: Vinyl }) => {
  const deleteVinyl = useVinylStore((s) => s.deleteVinyl);
  return (
    <div className="flex flex-col w-full">
      {/* 圖 */}
      <div className="aspect-square">
        <img
          src={vinyl.coverUrl || "/images/DEFAULT.jpg"}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/images/DEFAULT.jpg")}
        />
      </div>
      {/* 資訊 */}
      <h3>{vinyl.album}</h3>
      <h4>{vinyl.artist}</h4>
      <h5>{vinyl.year}</h5>
      {/* 評分 */}
      <div className="flex items-center text-yellow-500">
        <span className="text-sm text-gray-400 mr-1">Rating:</span>
        {/* 用簡單星號代表評分 */}
        {"★".repeat(vinyl.albumRating || 0)}
        <span className="text-gray-200">
          {"★".repeat(5 - (vinyl.albumRating || 0))}
        </span>
      </div>

      {/* 分類 */}
      <div className="flex flex-wrap ">
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
      </div>

      {/* 備註 */}
      <div>
        {vinyl.notes && (
          <p className="text-xs text-gray-400 line-clamp-2" title={vinyl.notes}>
            " {vinyl.notes} "
          </p>
        )}
      </div>
      {/* 操作 */}
      <div className="flex gap-2 items-center">
        <Link
          to={`edit/${vinyl._id}`}
          className="text-white hover:text-gray-400 transition-colors"
        >
          edit
        </Link>
        <button
          onClick={() => deleteVinyl(vinyl._id)}
          className="text-white hover:text-red-300 cursor-pointer transition-colors"
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default VinylCard;
