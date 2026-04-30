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

router.get("/", getAllVinyls);
router.post("/", validate(createVinylSchema), createVinyl);
router.get("/:id", getVinyl);
router.patch("/:id", validate(updateVinylSchema), editVinyl);
router.delete("/:id", validate(checkIdSchema), deleteVinyl);
export default router;
