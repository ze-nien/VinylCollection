import { useForm } from "react-hook-form";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import type { VinylBase } from "../types/vinyl";
import { vinylSchema } from "../../../shared/vinylSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVinylStore } from "../store/vinylStore";

import FormField from "./FormField";
import TrackList from "./TrackList";
import { useEffect } from "react";

const VinylForm = () => {
  const navigate = useNavigate();
  const addVinyl = useVinylStore((s) => s.addVinyl);
  const fetchVinyl = useVinylStore((s) => s.fetchVinyl);
  const clearVinyl = useVinylStore((s) => s.clearVinyl);
  const vinyl = useVinylStore((s) => s.vinyl);

  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<VinylBase>({
    resolver: zodResolver(vinylSchema),
    defaultValues: {
      album: "",
      artist: "",
      year: undefined,
      tracks: [], // 如果有 trackList，初始值設為空陣列
    },
    mode: "onChange", // 建議選用，這會讓使用者一輸錯就立刻看到 errors.message
  });

  useEffect(() => {
    if (id) fetchVinyl(id);
    return () => clearVinyl();
  }, [id, fetchVinyl, clearVinyl]);

  useEffect(() => {
    if (vinyl) reset(vinyl);
  }, [vinyl, reset]);

  const genreOptions = [
    "Pop",
    "Rock",
    "Hip Hop/Rap",
    "R&B/Soul",
    "Jazz",
    "Country",
    "EDM",
    "Indie/Alternative",
    "Classical",
    "Latin",
  ];

  const onSubmit: SubmitHandler<VinylBase> = (data) => {
    addVinyl(data);
    navigate("/");
  };

  const onInvalid: SubmitErrorHandler<VinylBase> = (errors) => {
    console.error("❌ 驗證攔截原因:", errors);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <FormField
          id="album"
          label="Album"
          tag="input"
          required={true}
          error={errors.album?.message as string}
          {...register("album")}
        />
        <FormField
          id="artist"
          label="Artist"
          tag="input"
          required={true}
          error={errors.artist?.message as string}
          {...register("artist")}
        />
        <FormField
          id="genre"
          label="Genre"
          tag="checkbox"
          options={genreOptions}
          error={errors.genre?.message as string}
          {...register("genre")}
        />
        <FormField
          id="coverUrl"
          label="CoverUrl"
          tag="input"
          error={errors.coverUrl?.message as string}
          {...register("coverUrl")}
        />
        <FormField
          id="year"
          label="Year"
          tag="input"
          type="number"
          min="1800"
          max={new Date().getFullYear()}
          error={errors.year?.message as string}
          {...register("year", {
            setValueAs: (value) => {
              if (value === "" || value === undefined || value === null)
                return undefined;

              const num = Number(value);
              return Number.isNaN(num) ? undefined : num;
            },
          })}
        />
        {errors.year?.message ? null : ( // 情況 A：有錯誤時，這裡其實可以留空，因為 VinylField 內部通常已經渲染了錯誤字串
          // 情況 B：沒錯誤時，顯示格式提示字
          <p className="text-[10px] text-gray-400 mt-1">
            💡 若有填寫，請符合 1999 格式 (範圍 1800-2026)
          </p>
        )}

        <TrackList control={control} register={register} errors={errors} />
        {/* rating */}
        <FormField
          id="comment"
          label="Comment"
          tag="textarea"
          error={errors.comment?.message as string}
          {...register("comment")}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default VinylForm;
