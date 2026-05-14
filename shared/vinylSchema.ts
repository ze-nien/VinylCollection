import { z } from "zod";
import { GENRES } from "../shared/constants.ts";

//資料規格
export const vinylSchema = z.object({
  album: z.string().min(1, "專輯名稱必填"),
  artist: z.string().min(1, "演出者必填"),
  genre: z.array(z.enum(GENRES)).optional(),
  coverUrl: z.string().optional(),
  year: z
    .number()
    .min(1950, "不早於1950年")
    .max(new Date().getFullYear(), "不超過今年")
    .optional(),
  albumRating: z.number().min(1, "最少一顆星").max(5),
  notes: z.string().optional(),
});
