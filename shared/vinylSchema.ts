import { z } from "zod";
import { GENRES } from "../shared/constants.ts";

//資料規格
export const vinylSchema = z.object({
  album: z.string().min(1, "專輯名稱必填"),
  artist: z.string().min(1, "演出者必填"),
  genre: z.array(z.enum(GENRES)).optional(),
  coverUrl: z.string().optional(),
  year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  albumRating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
});
