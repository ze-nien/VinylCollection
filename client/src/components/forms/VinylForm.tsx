import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useBlocker, useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import type { VinylBase } from "../../types/vinyl";
import { vinylSchema } from "../../types/vinyl";
import { GENRES } from "../../types/constants";
import { useVinylStore } from "../../store/vinylStore";

import FormField from "./FormField";
import StarRating from "./StarRating";
import Modal from "../Modal";
import toast from "react-hot-toast";
import { checkVinylDuplicate } from "../../utils/checkData";

const VinylForm = () => {
  const navigate = useNavigate();
  const addVinyl = useVinylStore((s) => s.addVinyl);
  const updateVinyl = useVinylStore((s) => s.updateVinyl);
  const clearVinyl = useVinylStore((s) => s.clearVinyl);
  const fetchVinyl = useVinylStore((s) => s.fetchVinyl);
  const vinyl = useVinylStore((s) => s.vinyl);
  const vinyls = useVinylStore((s) => s.vinyls);
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isSubmitSuccessful, isSubmitting },
  } = useForm<VinylBase>({
    // 透過 zodResolver 把 vinylSchema 的驗證規則整合到 react-hook-form 中
    resolver: zodResolver(vinylSchema),
    defaultValues: {
      album: "",
      artist: "",
      genre: [],
      coverUrl: "",
      version: "Standard",
      year: new Date().getFullYear(),
      albumRating: 1,
      notes: "",
    },
    //values 傳進來的變數發生變動時 自動把資料填入表單各個輸入框中
    values: vinyl //偵測vinyl從undefined變成一筆黑膠唱片資料 自動調用reset()
      ? (({ _id, ...rest }) => ({
          ...rest,
          year: Number(rest.year),
          albumRating: rest.albumRating ? Number(rest.albumRating) : 1,
        }))(vinyl)
      : undefined,
    mode: "onChange", //輸入錯立刻顯示errors.message
  });
  const watchNotes = useWatch({ control, name: "notes", defaultValue: "" });

  //編輯頁載入資料
  useEffect(() => {
    if (id) {
      fetchVinyl(id);
      window.scroll(0, 0);
    }
    return () => clearVinyl();
  }, [id, fetchVinyl, clearVinyl]);

  const onSubmit: SubmitHandler<VinylBase> = async (data) => {
    try {
      const checkResult = checkVinylDuplicate(id ?? null, data, vinyls);
      if (checkResult.type === "ABSOLUTE_DUPLICATE") {
        toast.error(
          `《${data.album}》(${data.version || "Standard"}) 已經存在於收藏中！`,
        );
        return;
      }
      if (isEditMode && id) {
        await updateVinyl(id, data);
      } else {
        await addVinyl(data);
      }
      window.scroll(0, 0);
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
      navigate("/");
    } catch (e) {
      console.error("提交黑膠表單時發生權限或阻斷錯誤：", e);
      navigate("/");
    }
  };

  const onInvalid: SubmitErrorHandler<VinylBase> = (errors) => {
    console.error("❌ 驗證攔截原因:", errors);
  };

  //useBlocker在換頁時攔截 .state有unblocked未攔截、blocked攔截、proceeding換頁
  const blocker = useBlocker(() => {
    //表單變動、submit未成功時攔截
    return isDirty && !isSubmitSuccessful && !isSubmitting;
  });

  return (
    <>
      {/*blocker是blocked時顯示 並且其狀態有reset與proceed兩個控制函式 */}
      <Modal
        title="未儲存的變更"
        isOpen={blocker.state === "blocked"}
        cancelText="繼續編輯"
        onClose={() => blocker.reset?.()} //留在原地並解鎖攔截
        confirmText="放棄編輯"
        onConfirm={() => blocker.proceed?.()} //放行換頁
      >
        <p>您輸入的黑膠唱片資料尚未儲存，離開將會遺失所有填寫的進度。</p>
      </Modal>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="p-2 grid grid-cols-1 gap-4 items-start">
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
              valueAsNumber: true,
            })}
          />
          <FormField
            id="version"
            label="Version"
            tag="input"
            error={errors.version?.message as string}
            {...register("version")}
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
              <div className="h-full flex gap-1 items-center justify-around">
                <span>Album Rating:</span>
                <StarRating
                  value={field.value || 0}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
          <div className="">
            <FormField
              id="genre"
              label="Genre"
              tag="checkbox"
              options={[...GENRES]}
              error={errors.genre?.message as string}
              {...register("genre")}
            />
          </div>
          <div className="">
            <FormField
              id="notes"
              label="Notes"
              tag="textarea"
              error={errors.notes?.message as string}
              {...register("notes")}
            />
            <p
              className={`text-xs text-right text-gray-300 ${watchNotes && watchNotes.length > 100 ? "text-red-400" : null} `}
            >
              {watchNotes?.length} / 100
            </p>
          </div>
          <div className=" text-center mb-2">
            <button
              className="hover:text-primary transition hover:cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default VinylForm;
