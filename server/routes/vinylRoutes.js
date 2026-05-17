import express from "express";
const router = express.Router();

import {
  createVinyl,
  deleteVinyl,
  editVinyl,
  getAllVinyls,
  getVinyl,
} from "../controllers/vinylController.js";

import {
  checkIdSchema,
  createVinylSchema,
  updateVinylSchema,
} from "../schemas/vinyl.js";

import validate from "../middlewares/validateMiddleware.js";

//帳號登入驗證
import verifyAdmin from "../middlewares/authMiddleware.js";

router.get("/", getAllVinyls);
router.post("/", verifyAdmin, validate(createVinylSchema), createVinyl);
router.get("/:id", getVinyl);
router.patch("/:id", verifyAdmin, validate(updateVinylSchema), editVinyl);
router.delete("/:id", verifyAdmin, validate(checkIdSchema), deleteVinyl);

export default router;
