import { useEffect, useState } from "react";
import { useBlocker } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { wishListSchema } from "../../types/wishList";
import type { WishListBase } from "../../types/wishList";
import { useWishListStore } from "../../store/wishListStore";
import { useVinylStore } from "../../store/vinylStore";
import { checkVinylDuplicate } from "../../utils/checkData";
import Modal from "../Modal";
import FormField from "./FormField";

const WishListForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wishList = useWishListStore((s) => s.wishList);
  const listData = useWishListStore((s) => s.listData);
  const addWishListData = useWishListStore((s) => s.addWishListData);
  const updateWishList = useWishListStore((s) => s.updateWishList);
  const clearListData = useWishListStore((s) => s.clearListData);
  const id = listData ? listData._id : null;
  const isEditMode = Boolean(id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitSuccessful, isSubmitting },
  } = useForm<WishListBase>({
    resolver: zodResolver(wishListSchema),
    defaultValues: {
      album: "",
      artist: "",
      notes: "",
      version: "Standard",
      year: new Date().getFullYear(),
      isAcquired: false,
    },
    values: listData
      ? (({ _id, ...rest }) => ({
          ...rest,
          year: Number(rest.year),
          version: listData.version === "" ? "Standard" : listData.version,
        }))(listData)
      : {
          album: "",
          artist: "",
          notes: "",
          version: "Standard",
          year: new Date().getFullYear(),
          isAcquired: false,
        },
    mode: "onChange",
  });

  useEffect(() => {
    return () => clearListData();
  }, [clearListData]);

  const blocker = useBlocker(() => {
    //表單變動、submit未成功時攔截
    return isDirty && !isSubmitSuccessful && !isSubmitting;
  });

  const onSubmit: SubmitHandler<WishListBase> = async (data) => {
    try {
      const targetVinyls = useVinylStore.getState().vinyls;
      const checkResult = checkVinylDuplicate(
        id ?? null,
        data,
        wishList,
        targetVinyls,
      );
      if (checkResult.type === "ABSOLUTE_DUPLICATE") {
        toast.error(
          `《${data.album}》(${data.version || "Standard"}) 已經存在於收藏或清單中！`,
        );
        return;
      }

      if (isEditMode && id) {
        await updateWishList(id, data);
      } else {
        await addWishListData(data);
      }
      reset({
        album: "",
        artist: "",
        notes: "",
        version: "Standard",
        year: undefined,
        isAcquired: false,
      });

      // --- 根據檢查結果，跳出不同的成功/警告通知 (UX) ---
      if (checkResult.type === "VERSION_DIFFERENT") {
        toast(`儲存成功！已調整為不同版本。`, {
          icon: "⚠️",
          className: "rounded-xl font-medium",
          duration: 4000,
        });
      } else {
        // SAFE 狀態
        toast.success(isEditMode ? "編輯成功" : "新增成功");
      }
      reset();
      clearListData();
      useWishListStore.getState().fetchWishList(1);
    } catch (e) {
      console.error("提交黑膠表單時發生權限或阻斷錯誤：", e);
    }
  };

  return (
    <>
      {/* 展開收起 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center cursor-pointer 
        p-2 md:hidden"
      >
        <span className="text-sm text-gray-300">
          {isOpen ? "▲ 收起" : "▼ 展開新增表單"}
        </span>
      </div>

      <Modal
        isOpen={blocker.state === "blocked"}
        cancelText="繼續編輯"
        onClose={() => blocker.reset?.()} //留在原地並解鎖攔截
        confirmText="放棄編輯"
        onConfirm={() => blocker.proceed?.()} //放行換頁
      >
        <p>您輸入的願望清單資料尚未儲存，現在離開將會遺失所有填寫的進度。</p>
      </Modal>

      <div
        className={`overflow-hidden transition-all duration-300
      ${isOpen ? "max-h-125 opacity-100 py-2" : "max-h-0 opacity-0"}
      md:mt-2 md:max-h-none md:opacity-100 md:py-0 space-y-2
    `}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 flex flex-col gap-2
          md:grid md:grid-cols-4"
        >
          <FormField
            id="album"
            label="Album"
            tag="input"
            error={errors.album?.message as string}
            {...register("album")}
          />
          <FormField
            id="artist"
            label="Artist"
            tag="input"
            error={errors.artist?.message as string}
            {...register("artist")}
          />
          <FormField
            id="year"
            label="Year"
            tag="input"
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            suppressHydrationWarning //忽略此處的伺服器與客戶端時間差
            error={errors.year?.message as string}
            {...register("year", {
              setValueAs: (value) => (value === "" ? 0 : Number(value)),
            })}
          />
          <FormField
            id="version"
            label="Version"
            tag="input"
            error={errors.version?.message as string}
            {...register("version")}
          />
          <div className="md:col-span-4 md:row-start-2">
            <FormField
              id="notes"
              label="Notes"
              tag="textarea"
              maxLength={100}
              defaultValue={listData ? listData.notes : ""}
              error={errors.notes?.message as string}
              {...register("notes")}
            />
          </div>
          <div className="flex justify-center md:col-span-4 md:row-start-3 w-full">
            <button
              disabled={isSubmitting}
              type="submit"
              className="text-primary bg-secondary px-2 transition
      hover:cursor-pointer hover:bg-primary hover:text-secondary
       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {listData ? "Submit" : "Add"}
            </button>
            {(isEditMode || isDirty) && (
              <button
                type="button"
                onClick={() => {
                  clearListData(); //Store listData變null
                  reset({
                    album: "",
                    artist: "",
                    notes: "",
                    version: "Standard",
                    year: new Date().getFullYear(),
                    isAcquired: false,
                  }); //資料回預設值
                }}
                className="px-2 hover:text-gray-400 hover:cursor-pointer transition
                disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default WishListForm;
