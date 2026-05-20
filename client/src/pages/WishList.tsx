import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useAuthStore } from "../store/authStore";
import { useWishListStore } from "../store/wishListStore";
import type { WishListBase } from "../types/wishList";
import FieldWrapper from "../components/forms/FieldWrapper";

const WishList = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const wishList = useWishListStore((s) => s.wishList);
  const fetchWishList = useWishListStore((s) => s.fetchWishList);
  const addWishListData = useWishListStore((s) => s.addWishListData);
  const updateWishList = useWishListStore((s) => s.updateWishList);
  const deleteWishListData = useWishListStore((s) => s.deleteWishListData);

  useEffect(() => {
    fetchWishList();
  }, [fetchWishList]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WishListBase>({
    defaultValues: {
      album: "",
      artist: "",
      notes: "",
      isAcquired: false,
    },
  });

  const onSubmit: SubmitHandler<WishListBase> = async (data) => {
    try {
      await addWishListData(data);
      reset();
    } catch (e) {
      console.error("提交黑膠表單時發生權限或阻斷錯誤：", e);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 新增 */}
      {isAuthenticated && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="ml-10 mr-10 mb-5 grid grid-cols-1 md:grid-cols-3 md:ml-5 md:mr-5 gap-5"
        >
          <FieldWrapper
            label="Album"
            error={errors.album?.message as string}
            id="album"
          >
            <div className="flex flex-col">
              <input
                type="text"
                id="album"
                {...register("album", { required: "專輯名稱必填" })}
                className="h-8 text-secondary rounded-md"
              />
            </div>
          </FieldWrapper>
          <FieldWrapper
            label="Artist"
            error={errors.artist?.message as string}
            id="artist"
          >
            <div className="flex flex-col">
              {/* <label htmlFor="artist">Artist: </label> */}
              <input
                type="text"
                id="artist"
                {...register("artist", { required: "演出者必填" })}
                className="h-8 text-secondary rounded-md"
              />
            </div>
          </FieldWrapper>
          <FieldWrapper
            label="Notes"
            error={errors.notes?.message as string}
            id="notes"
          >
            <div className="flex flex-col">
              <input
                type="text"
                id="notes"
                {...register("notes")}
                className="h-8 text-secondary rounded-md"
              />
            </div>
          </FieldWrapper>

          <button
            type="submit"
            className="text-primary bg-secondary h-full w-12  font-semibold rounded-sm 
      hover:cursor-pointer hover:bg-primary hover:text-secondary transition"
          >
            Add
          </button>
        </form>
      )}
      {/* 現有 */}
      <div className="flex flex-col px-5 w-full gap-3">
        {wishList.length > 0 &&
          wishList.map((d) => (
            <div
              key={d._id}
              className={`grid ${isAuthenticated ? "grid-cols-2" : "grid-cols-1"} border border-white`}
            >
              <div className="p-2 flex gap-5 items-center">
                <h4 className="text-lg">{d.album}</h4>
                <h5 className="">{d.artist}</h5>
                <h6 className="text-sm break-all">{d.notes}</h6>
              </div>
              {isAuthenticated && (
                <div className="flex gap-2 justify-end pr-2">
                  <button
                    onClick={() => updateWishList(d._id)}
                    className="rounded-xs text-white hover:cursor-pointer hover:text-primary transition"
                  >
                    Purchased
                  </button>
                  <button
                    onClick={() => deleteWishListData(d._id)}
                    className="text-red-200 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default WishList;
