import { z } from "zod";

//資料規格
const vinylSchema = z.object({
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
      trackRatings: z.array([
        z.object({ trackId: z.number(), score: z.number().min(0).max(5) }),
      ]),
    })
    .optional(),
});

//新增POST
export const createVinylSchema = z.object({
  body: z.object({ ...vinylSchema.shape }),
});

//修改PATCH
export const updateVinylSchema = z.object({
  body: z.object({ ...vinylSchema.shape }).partial(),
  params: z
    .object({
      id: z
        .string()
        .length(24, "無效ID格式")
        .regex(/^[0-9a-fA-F]{24}$/, "ID 格式不符合十六進位規範"),
    })
    .optional(),
});

//查詢單筆GET 刪除DELETE ->檢查ID
export const checkIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24, "無效ID格式")
      .regex(/^[0-9a-fA-F]{24}$/, "ID 格式不符合十六進位規範"),
  }),
});

//查詢列表GET ->檢查篩選
export const getAllVinylsSchema = z.object({
  query: z.object({
    artist: z.string().optional(),
    genre: z.string().optional(),
    year: z
      .string()
      .regex(/^d{4}$/)
      .transform(Number)
      .optional(),
    rating: z.string().transform(Number).optional(),
    //確保前端albumRating傳進來的name是rating
  }),
});
