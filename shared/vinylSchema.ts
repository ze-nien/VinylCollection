import { z } from "zod";

//資料規格
export const vinylSchema = z.object({
  album: z.string().min(1, "專輯名稱必填"),
  artist: z.string().min(1, "演出者必填"),
  genre: z.array(z.string()).min(1, "音樂類別必填"),
  coverUrl: z.string().optional(),
  year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  tracks: z
    .array(
      z.object({
        trackNo: z.number().min(1, "請輸入曲目編號"),
        title: z.string().min(1, "歌名必填"),
        duration: z
          .string()
          .regex(/^[0-9]{2}:[0-9]{2}$/, "格式需為 MM:SS")
          .or(z.literal(""))
          .optional(),
      }),
    )
    .optional(),
  comment: z.string().optional(),
  rating: z
    .object({
      albumRating: z.number().min(0).max(5).default(0).optional(),
      trackRatings: z.array(
        z.object({
          trackNo: z.number(),
          score: z.number().min(0).max(5).default(0).optional(),
        }),
      ),
    })
    .optional(),
});
