import { Controller, useForm } from "react-hook-form";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import type { VinylBase } from "../types/vinyl";
import { vinylSchema } from "../../../shared/vinylSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVinylStore } from "../store/vinylStore";

import FormField from "./FormField";
import { useEffect } from "react";
import StarRating from "./StarRating";

import { GENRES } from "../../../shared/constants";

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
    reset,
    formState: { errors },
  } = useForm<VinylBase>({
    resolver: zodResolver(vinylSchema),
    defaultValues: {
      album: "",
      artist: "",
      year: undefined,
      albumRating: 0,
    },
    mode: "onChange", //輸入錯立刻顯示errors.message
  });

  useEffect(() => {
    if (id) fetchVinyl(id);
    return () => clearVinyl();
  }, [id, fetchVinyl, clearVinyl]);

  useEffect(() => {
    if (vinyl) {
      console.log(vinyl);
      reset({
        ...vinyl,
        year: vinyl.year ? Number(vinyl.year) : undefined,
        albumRating: vinyl.albumRating ? Number(vinyl.albumRating) : undefined,
      });
    }
  }, [vinyl, reset]);

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
          options={[...GENRES]}
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
        <Controller
          control={control}
          name={`albumRating`}
          render={({ field }) => (
            <div className="flex items-center gap-2 mt-4">
              <span>Album Rating:</span>
              <StarRating value={field.value || 0} onChange={field.onChange} />
            </div>
          )}
        />
        <FormField
          id="notes"
          label="Notes"
          tag="textarea"
          error={errors.notes?.message as string}
          {...register("notes")}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default VinylForm;
