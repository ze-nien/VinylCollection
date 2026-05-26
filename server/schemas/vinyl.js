import { z } from "zod";
import { vinylSchema } from "../types/vinylSchema.js";

export const createVinylSchema = z.object({
  body: vinylSchema,
});

//修改PATCH
export const updateVinylSchema = z.object({
  body: vinylSchema.partial(),
  params: z.object({
    id: z
      .string()
      .length(24, "無效ID格式")
      .regex(/^[0-9a-fA-F]{24}$/, "ID 格式不符合十六進位規範"),
  }),
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
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 12)),
    sort: z.string().optional(),
    genre: z.string().optional(),
    yearRange: z.string().optional(),
    minAlbumRating: z.string().optional(),
  }),
});
