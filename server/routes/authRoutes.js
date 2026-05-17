import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

//帳密驗證
router.post("/login", (req, res) => {
  const { userName, password } = req.body;
  if (
    userName === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // 簽發一張 24 小時後過期的管理員通行證
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.json({ success: true, token });
  }
  const error = new Error("帳號或密碼錯誤");
  res.statusCode = 401;
  return next(error);
});

export default router;
