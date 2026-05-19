import express from "express";
const router = express.Router();
import { parseUser } from "../middlewares/authMiddleware.js";
import {
  verifyUser,
  logoutUser,
  checkRole,
} from "../controllers/authController.js";

router.post("/login", verifyUser);
router.post("/logout", logoutUser);
router.get("/me", parseUser, checkRole);

export default router;
