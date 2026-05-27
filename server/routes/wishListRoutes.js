import express from "express";
const router = express.Router();

import { parseUser, requireAdmin } from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import {
  createWishListSchema,
  updateWishListSchema,
  checkIdSchema,
} from "../schemas/wishList.js";

import {
  getWishList,
  getWishListData,
  createWishListData,
  updateWishListData,
  deleteWishListData,
  moveToVinyl,
  fetchStatsWL,
} from "../controllers/wishListController.js";

router.get("/", getWishList);
router.post(
  "/",
  parseUser,
  requireAdmin,
  validate(createWishListSchema),
  createWishListData,
);
router.get("/stats", fetchStatsWL);
router.get(
  "/:id",
  parseUser,
  requireAdmin,
  validate(checkIdSchema),
  getWishListData,
);
router.patch(
  "/:id",
  parseUser,
  requireAdmin,
  validate(updateWishListSchema),
  updateWishListData,
);
router.delete(
  "/:id",
  parseUser,
  requireAdmin,
  validate(checkIdSchema),
  deleteWishListData,
);
router.post("/acquire/:id", parseUser, requireAdmin, moveToVinyl);
export default router;
