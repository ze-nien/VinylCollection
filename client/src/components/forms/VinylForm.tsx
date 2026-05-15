import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import type { VinylBase } from "../../types/vinyl";
import { vinylSchema } from "../../../../shared/vinylSchema";
import { GENRES } from "../../../../shared/constants";
import { useVinylStore } from "../../store/vinylStore";

import FormField from "./FormField";
import StarRating from "./StarRating";

const VinylForm = () => {
  const navigate = useNavigate();
  const addVinyl = useVinylStore((s) => s.addVinyl);
  const updateVinyl = useVinylStore((s) => s.updateVinyl);
  const clearVinyl = useVinylStore((s) => s.clearVinyl);
  const fetchVinyl = useVinylStore((s) => s.fetchVinyl);
  const vinyl = useVinylStore((s) => s.vinyl);
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VinylBase>({
    // 透過 zodResolver 把 vinylSchema 的驗證規則整合到 react-hook-form 中
    resolver: zodResolver(vinylSchema),
    defaultValues: {
      album: "",
      artist: "",
      genre: [],
      coverUrl: "",
      year: undefined,
      albumRating: 1,
      notes: "",
    },
    //values 傳進來的變數發生變動時 自動把資料填入表單各個輸入框中
    values: vinyl //偵測vinyl從undefined變成一筆黑膠唱片資料 自動調用reset()
      ? {
          ...vinyl,
          year: vinyl.year ? Number(vinyl.year) : undefined,
          coverUrl: vinyl.coverUrl ? String(vinyl.coverUrl) : "",
          albumRating: vinyl.albumRating ? Number(vinyl.albumRating) : 1,
        }
      : undefined,
    mode: "onChange", //輸入錯立刻顯示errors.message
  });

  //編輯頁載入資料
  useEffect(() => {
    if (id) fetchVinyl(id);
    return () => clearVinyl();
  }, [id, fetchVinyl, clearVinyl]);

  const onSubmit: SubmitHandler<VinylBase> = async (data) => {
    if (isEditMode && id) {
      await updateVinyl(id, data);
    } else {
      await addVinyl(data);
    }
    navigate("/");
  };

  const onInvalid: SubmitErrorHandler<VinylBase> = (errors) => {
    console.error("❌ 驗證攔截原因:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <div className="p-2 grid grid-cols-2 gap-4 items-start">
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
        {/* 
           不是input可以使用register 不具備原生ref、onChange
           因此使用Controller監控自訂組件狀態 同步回傳RHF 
           name是物件中的key鍵
           rander回傳function 原參數methods含field fieldState formState
           解構field傳入函數 其包含value、onChange、onBlur、name、ref屬性
        */}
        <Controller
          control={control}
          name="albumRating"
          render={({ field }) => (
            <div className="h-full flex gap-1 items-center justify-center">
              <span>Album Rating:</span>
              <StarRating value={field.value || 0} onChange={field.onChange} />
            </div>
          )}
        />
        <div className="col-span-2">
          <FormField
            id="genre"
            label="Genre"
            tag="checkbox"
            options={[...GENRES]}
            error={errors.genre?.message as string}
            {...register("genre")}
          />
        </div>
        <div className="col-span-2">
          <FormField
            id="notes"
            label="Notes"
            tag="textarea"
            error={errors.notes?.message as string}
            {...register("notes")}
          />
        </div>
        <div className="col-span-2 text-center mb-2">
          <button type="submit">submit</button>
        </div>
      </div>
    </form>
  );
};

export default VinylForm;
