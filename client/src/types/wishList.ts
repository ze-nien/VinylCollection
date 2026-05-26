import { z } from "zod";
// import { wishListSchema } from "../../../shared/wishListSchema";

export const wishListSchema = z.object({
  album: z.string().min(1, "專輯名稱必填").max(200, "專輯名稱不能超過200字"),
  artist: z.string().min(1, "演出者必填").max(100, "演出者不能超過100字"),
  notes: z.string().max(100, "備註不能超過 100 個字").optional(),
  isAcquired: z.boolean().default(false),
  coverUrl: z.string().optional(),
  year: z
    .number()
    .min(1950, "不早於1950年")
    .max(new Date().getFullYear(), "不超過今年"),
  version: z.string().max(50, "版本不能超過50字").default("Standard"),
});

export type WishListBase = z.infer<typeof wishListSchema>;

export interface WishList extends WishListBase {
  _id: string;
}
