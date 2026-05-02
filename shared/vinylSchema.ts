import { z } from "zod";

//資料規格
export const vinylSchema = z.object({
  album: z.string().min(1, "專輯名稱必填"),
  artist: z.string().min(1, "專輯名稱必填"),
  genre: z.array(z.string().toLowerCase()).optional(),
  coverUrl: z.string().url("請輸入正確URL格式").optional(),
  year: z.string().optional(),
  tracks: z
    .array(
      z.object({ id: z.number(), title: z.string(), duration: z.string() }),
    )
    .optional(),
  comment: z.string().optional(),
  rating: z
    .object({
      albumRating: z.number().min(0).max(5),
      trackRatings: z.array(
        z.object({ trackId: z.number(), score: z.number().min(0).max(5) }),
      ),
    })
    .optional(),
});
