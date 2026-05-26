import { z } from "zod";
import { wishListSchema } from "../types/wishListSchema.js";

//新增
export const createWishListSchema = z.object({
  body: wishListSchema,
});

//修改
export const updateWishListSchema = z.object({
  body: wishListSchema.partial(),
  params: z.object({
    id: z
      .string()
      .length(24, "無效ID格式")
      .regex(/^[0-9a-fA-F]{24}$/, "ID 格式不符合十六進位規範"),
  }),
});

//查詢、刪除
export const checkIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24, "無效ID格式")
      .regex(/^[0-9a-fA-F]{24}$/, "ID 格式不符合十六進位規範"),
  }),
});

export const getWishListSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10)),
  }),
});
