import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useVinylStore } from "../store/vinylStore";
import type { VinylBase } from "../types/vinyl";
import { useNavigate } from "react-router";

const VinylForm = () => {
  const navgiate = useNavigate();
  const addVinyl = useVinylStore((s) => s.addVinyl);

  const { register, handleSubmit } = useForm<VinylBase>({
    defaultValues: {
      album: "",
      artist: "",
    },
  });

  const onSubmit: SubmitHandler<VinylBase> = (data) => {
    addVinyl(data);
    navgiate("/");
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="album">album:</label>
        <input
          type="text"
          id="album"
          className="border border-black"
          {...register("album")}
        />
        <label htmlFor="artist">artist:</label>
        <input
          type="text"
          id="artist"
          className="border border-solid border-black"
          {...register("artist")}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default VinylForm;
