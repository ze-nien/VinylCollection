import express from "express";
const router = express.Router();

import validate from "../middlewares/validateMiddleware.js";
import {
  createWishListSchema,
  deleteWishListSchema,
} from "../schemas/wishList.js";

import {
  createWishListData,
  deleteWishListData,
  updateWishListDataStatus,
  getWishList,
} from "../controllers/wishListController.js";

router.get("/", getWishList);
router.post("/", validate(createWishListSchema), createWishListData);
router.delete("/:id", validate(deleteWishListSchema), deleteWishListData);
router.post("/acquire/:id", updateWishListDataStatus);
export default router;
