import { z } from "zod";
import { GENRES } from "./constants.js";

//資料規格
export const vinylSchema = z.object({
  album: z.string().min(1, "專輯名稱必填").max(200, "專輯名稱不能超過200字"),
  artist: z.string().min(1, "演出者必填").max(100, "演出者不能超過100字"),
  genre: z.array(z.enum(GENRES)).optional(),
  coverUrl: z.string().optional(),
  version: z.string().max(50, "版本不能超過50字").default("Standard"),
  year: z
    .number()
    .min(1950, "不早於1950年")
    .max(new Date().getFullYear(), "不超過今年"),
  albumRating: z.number().min(1, "最少一顆星").max(5),
  notes: z.string().max(100, "備註不能超過 100 個字").optional(),
});
