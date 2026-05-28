import { useState } from "react";
import { Link } from "react-router";
import type { Vinyl } from "../types/vinyl.ts";
import { useVinylStore } from "../store/vinylStore.ts";
import { useAuthStore } from "../store/authStore.ts";
import Modal from "./Modal.tsx";

//複雜度
const VinylCard = ({ vinyl }: { vinyl: Vinyl }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const deleteVinyl = useVinylStore((s) => s.deleteVinyl);
  const [showNotes, setShowNotes] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <div className="flex flex-col w-70 md:w-50">
      {/* 圖 */}
      <div className="relative aspect-square">
        <a target="_blank" href={vinyl.coverSource || ""}>
          <img
            src={vinyl.coverUrl || "/images/DEFAULT.jpg"}
            alt={`${vinyl.album} - ${vinyl.artist}`}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/images/DEFAULT.jpg")}
          />
        </a>

        {/* 備註 */}
        {vinyl.notes && (
          <div>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="absolute top-1 right-1 z-20
               bg-black/30 text-gray-300/80
                hover:bg-black/70 hover:text-gray-200 transition
                 rounded-full size-5
                 flex items-center justify-center text-xs"
            >
              i
            </button>
            <div
              className={`absolute inset-0 bg-black/60 backdrop-blur-xs p-4 transition
        flex flex-col items-center justify-center text-center
       ${
         showNotes
           ? "opacity-100 pointer-events-auto"
           : "opacity-0 pointer-events-none"
       } `}
            >
              <p
                className={`text-xs text-gray-400 break-all `}
                title={vinyl.notes}
              >
                &quot; {vinyl.notes} &quot;
              </p>
            </div>
          </div>
        )}
      </div>
      {/* 資訊 */}
      <h3 className="text-xl">{vinyl.album}</h3>
      <h4 className="text-lg">{vinyl.artist}</h4>
      <h5 className="text-sm">{vinyl.year}</h5>
      <h6 className="text-xs">{`Version: ${vinyl.version}`}</h6>
      {/* 評分 */}
      <div className="flex items-center text-primary">
        <span className="text-sm text-white mr-1">Rating:</span>
        {/* 用簡單星號代表評分 */}
        {"★".repeat(vinyl.albumRating || 0)}
        <span className="text-gray-200">
          {"★".repeat(5 - (vinyl.albumRating || 0))}
        </span>
      </div>

      {/* 分類 */}
      <div className="flex flex-wrap gap-1">
        {Array.isArray(vinyl.genre) && vinyl.genre.length > 0
          ? (vinyl.genre as string[]).map((g) => (
              <span
                key={g}
                className="text-xs bg-primary text-secondary px-2 py-0.5 rounded-full border"
              >
                #{g}
              </span>
            ))
          : "未分類"}
      </div>

      {/* 操作 */}
      {isAuthenticated && user?.role === "admin" && (
        <div className="flex gap-2 items-center">
          <Link
            to={`edit/${vinyl._id}`}
            className="text-gray-300 hover:text-gray-400 transition-colors"
          >
            edit
          </Link>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-200 hover:text-red-400 cursor-pointer transition-colors"
          >
            delete
          </button>
        </div>
      )}

      {/* 確認刪除 */}
      <Modal
        isOpen={isDeleteOpen}
        title="刪除"
        onClose={() => setIsDeleteOpen(false)}
        cancelText="取消刪除"
        onConfirm={() => deleteVinyl(vinyl._id)}
        confirmText="確定刪除"
      >
        <p>
          確定刪除 {vinyl.artist} - {vinyl.album} ?
        </p>
      </Modal>
    </div>
  );
};

export default VinylCard;
