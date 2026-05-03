import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useVinylStore } from "../store/vinylStore";
import type { VinylBase } from "../types/vinyl";
import { useNavigate } from "react-router";
import FormField from "./FormField";

const VinylForm = () => {
  const navgiate = useNavigate();
  const addVinyl = useVinylStore((s) => s.addVinyl);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VinylBase>({
    defaultValues: {
      album: "",
      artist: "",
    },
  });

  const genreOptions = [
    { label: "搖滾 (Rock)", value: "rock" },
    { label: "爵士 (Jazz)", value: "jazz" },
    { label: "流行 (Pop)", value: "pop" },
    { label: "嘻哈 (Hip Hop)", value: "hiphop" },
  ];

  const onSubmit: SubmitHandler<VinylBase> = (data) => {
    addVinyl(data);
    navgiate("/");
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="album"
          tag="input"
          error={errors.album?.message as string}
          {...register("album")}
        />
        <FormField
          label="artist"
          tag="input"
          error={errors.artist?.message as string}
          {...register("artist")}
        />
        <FormField
          label="genre"
          tag="checkbox"
          options={genreOptions}
          error={errors.genre?.message as string}
          {...register("genre")}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default VinylForm;
