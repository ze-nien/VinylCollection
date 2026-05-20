import { z } from "zod";

export const wishListSchema = z.object({
  album: z.string().min(1, "專輯名稱必填"),
  artist: z.string().min(1, "演出者必填"),
  notes: z.string().max(200, "備註內容不能超過 200 個字").optional(),
  isAcquired: z.boolean().default(false),
});
