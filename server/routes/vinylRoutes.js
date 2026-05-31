import express from "express";
const router = express.Router();

import Vinyl from "../models/Vinyl.js";
import { parseUser, requireAdmin } from "../middlewares/authMiddleware.js";

import validate from "../middlewares/validateMiddleware.js";
import {
  checkIdSchema,
  createVinylSchema,
  updateVinylSchema,
} from "../schemas/vinyl.js";
import { checkData } from "../middlewares/checkDataMiddleware.js";

import {
  createVinyl,
  deleteVinyl,
  editVinyl,
  getAllVinyls,
  getVinyl,
  fetchStats,
} from "../controllers/vinylController.js";

router.get("/", getAllVinyls);
router.post(
  "/",
  parseUser,
  requireAdmin,
  validate(createVinylSchema),
  checkData(Vinyl),
  createVinyl,
);
router.get("/stats", fetchStats);
router.get("/:id", getVinyl);
router.patch(
  "/:id",
  parseUser,
  requireAdmin,
  validate(updateVinylSchema),
  checkData(Vinyl),
  editVinyl,
);
router.delete(
  "/:id",
  parseUser,
  requireAdmin,
  validate(checkIdSchema),
  deleteVinyl,
);

export default router;
