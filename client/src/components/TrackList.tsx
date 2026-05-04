import { useFieldArray } from "react-hook-form";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import FormField from "./FormField";
import type { VinylBase } from "../types/vinyl";
import StarRating from "./StarRating";

interface TrackListProps {
  control: Control<VinylBase>;
  register: UseFormRegister<VinylBase>;
  errors: FieldErrors<VinylBase>;
}

const TrackList = ({ control, register, errors }: TrackListProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tracks", // 必須與 Schema 中的名稱一致
  });

  const handleAddTrack = () => {
    // 根據目前陣列長度 + 1 作為 ID
    const newId = fields.length + 1;

    append({
      trackNo: newId, // 隨著數量變動的 ID
      title: "",
      duration: "",
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">曲目列表 (Tracks)</h3>
        <button
          type="button"
          onClick={handleAddTrack}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
        >
          + 新增曲目
        </button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="p-4 border rounded-lg bg-gray-50 relative"
        >
          <div className="flex items-center justify-around">
            <FormField
              id={`trackNo${index + 1}`}
              label="TrackNo"
              tag="input"
              type="number"
              {...register(`tracks.${index}.trackNo`, { valueAsNumber: true })}
              error={errors.tracks?.[index]?.trackNo?.message as string}
            />
            {/* 曲目名稱 */}
            <div className="">
              <FormField
                id={`tracks.${index}.title`}
                label="Title"
                tag="input"
                {...register(`tracks.${index}.title`)}
                error={errors.tracks?.[index]?.title?.message as string}
                placeholder="例如: Bohemian Rhapsody"
              />
            </div>

            {/* 曲目長度 */}
            <div className="">
              <FormField
                id={`tracks.${index}.duration`}
                label="Duration"
                tag="input"
                {...register(`tracks.${index}.duration`)}
                error={errors.tracks?.[index]?.duration?.message as string}
                placeholder="05:55 (選填)"
              />
            </div>
            {/* 刪除按鈕 */}
            <div className="">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-700 font-bold text-xl"
                title="刪除此曲目"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
