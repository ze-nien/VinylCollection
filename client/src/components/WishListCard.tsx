import { useState } from "react";
import toast from "react-hot-toast";
import { useLineClamp } from "../hooks/useLineClamp";
import type { WishList } from "../types/wishList";
import { checkVinylDuplicate } from "../utils/checkData";
import { useAuthStore } from "../store/authStore";
import { useWishListStore } from "../store/wishListStore";
import { useVinylStore } from "../store/vinylStore";
import Modal from "./Modal";

const WishListCard = ({ data }: { data: WishList }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const moveToVinyl = useWishListStore((s) => s.moveToVinyl);
  const deleteWishListData = useWishListStore((s) => s.deleteWishListData);
  const fetchWishListData = useWishListStore((s) => s.fetchWishListData);
  const fetchVinyls = useVinylStore((s) => s.fetchVinyls);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [notesAll, setNotesAll] = useState(false);
  const { elementRef, isClamped } = useLineClamp([data.notes, notesAll]);

  const handlePurchased = async (listData: WishList) => {
    try {
      await fetchVinyls();
      const targetVinyls = useVinylStore.getState().vinyls;
      const checkResult = checkVinylDuplicate(null, listData, targetVinyls);
      if (checkResult.type === "ABSOLUTE_DUPLICATE") {
        toast.error(
          `轉移失敗！您的實際收藏中已存在《${listData.album}》(${listData.version}) `,
        );
        return;
      }
      if (checkResult.type === "VERSION_DIFFERENT") {
        await moveToVinyl(listData._id);
        toast(`已成功移至收藏！已自動為您區分為不同版本。`, {
          icon: "⚠️",
          className: "rounded-xl font-medium",
          duration: 4000,
        });
        return;
      }
      await moveToVinyl(listData._id);
      toast.success(`《${listData.album}》已正式移至您的黑膠收藏`);
    } catch (error) {
      console.error("轉移資料時發生錯誤：", error);
    }
  };

  return (
    <div
      key={data._id}
      className={`flex flex-col gap-2 p-2 md:grid
                ${
                  isAuthenticated
                    ? "md:grid-cols-[minmax(100px,1fr)_3fr_1fr]"
                    : "md:grid-cols-[minmax(100px,1fr)_3fr]"
                } 
                  border border-primary rounded-lg w-full
                  `}
    >
      {/* 圖 */}
      <div className="flex items-center justify-center">
        <div className="size-48 md:size-20 md:w-full md:h-auto md:aspect-square">
          <a target="_blank" href={data.coverSource || ""}>
            <img
              src={data.coverUrl || "/images/DEFAULT.jpg"}
              alt={`${data.album} - ${data.artist}`}
              className="w-full h-full object-cover rounded-md shrink-0"
              onError={(e) => (e.currentTarget.src = "/images/DEFAULT.jpg")}
            />
          </a>
        </div>
      </div>
      {/* 資料 */}
      <div className="flex flex-col gap-1 h-40">
        <h4 className="text-lg">{data.album}</h4>
        <h5 className="text-sm">{data.artist}</h5>
        <h6 className="text-xs">{data.year}</h6>
        <h6 className="text-xs">Version: {data.version}</h6>
        <div>
          {data.notes?.trim() ? (
            <>
              {/* 有備註內容固定兩行高 動態摺疊滾動 */}
              <div
                className={`h-12 ${notesAll ? "overflow-y-auto scrollbar-thin" : "overflow-hidden"}`}
              >
                <h6
                  ref={elementRef}
                  className={`text-sm break-all text-gray-400 ${notesAll ? "line-clamp-none" : "line-clamp-2"}`}
                >
                  Notes: {data.notes}
                </h6>
              </div>
              {/* 超過兩行或展開才渲染按鈕 */}
              {data.notes && (
                <button
                  onClick={() => setNotesAll(!notesAll)}
                  className={`text-xs cursor-pointer block hover:underline
                    ${
                      notesAll || isClamped
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                >
                  {notesAll ? "收起" : "顯示更多"}
                </button>
              )}
            </>
          ) : (
            <h6 className="text-sm break-all text-gray-500">Notes: None</h6>
          )}
        </div>
      </div>
      {/* 操作 */}
      {isAuthenticated && (
        <div className="flex flex-col gap-2 justify-center pr-2">
          <button
            onClick={() => {
              fetchWishListData(data._id);
              window.scroll(0, 0);
            }}
            className="text-gray-300 hover:text-gray-400 cursor-pointer transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handlePurchased(data)}
            className="rounded-xs text-white hover:cursor-pointer hover:text-primary transition"
          >
            Purchased
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-200 hover:text-red-400 cursor-pointer transition-colors"
          >
            Delete
          </button>
        </div>
      )}
      <Modal
        isOpen={isDeleteOpen}
        title="刪除"
        onClose={() => setIsDeleteOpen(false)}
        cancelText="取消刪除"
        onConfirm={() => deleteWishListData(data._id)}
        confirmText="確定刪除"
      >
        <p>
          確定刪除 {data.artist} - {data.album} ?
        </p>
      </Modal>
    </div>
  );
};

export default WishListCard;
