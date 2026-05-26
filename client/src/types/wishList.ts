import { z } from "zod";
import { wishListSchema } from "../../../shared/wishListSchema";

export type WishListBase = z.infer<typeof wishListSchema>;

export interface WishList extends WishListBase {
  _id: string;
}
