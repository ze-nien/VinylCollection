import { z } from "zod";
import { wishListSchema } from "../../shared/wishListSchema.js";

//新增
export const createWishListSchema = z.object({
  body: wishListSchema,
});

//刪除
export const deleteWishListSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24, "無效ID格式")
      .regex(/^[0-9a-fA-F]{24}$/, "ID 格式不符合十六進位規範"),
  }),
});
