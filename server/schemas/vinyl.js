import { z } from "zod";
import { vinylSchema } from "../../shared/vinylSchema.ts";

export const createVinylSchema = z.object({
  body: vinylSchema,
});

//修改PATCH
export const updateVinylSchema = z.object({
  body: vinylSchema.partial(),
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
