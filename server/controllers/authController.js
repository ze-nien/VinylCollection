import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

//驗證帳密
export const verifyUser = (req, res, next) => {
  const { userName, password } = req.body;
  if (
    userName === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // 簽發一張15分鐘後過期的管理員通行證
    const token = jwt.sign(
      {
        role: "admin",
        ua: req.headers["user-agent"],
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    res.cookie("token", token, {
      httpOnly: true, //防XSS攻擊 Token被複製
      //strict防CSRF攻擊 跨站請求偽造
      sameSite: isProduction ? "none" : "lax", //上線跨網域用none 本地端用lax
      //防 MITM 未加密的網路上被空中竊聽
      secure: isProduction, //上線開啟 HTTPS 加密，本地端關閉
      maxAge: 15 * 60 * 1000, //Token同步15分鐘
    });
    return res.json({
      success: true,
      role: "admin",
      userName: userName,
      message: "登入成功",
    });
  }
  const e = new Error("帳號或密碼錯誤");
  e.status = 401;
  return next(e);
};

//登出
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax", //上線跨網域用none 本地端用lax
    secure: isProduction, //上線開啟 HTTPS 加密，本地端關閉
  });
  return res.json({ success: true, message: "已登出" });
};

//身份
export const checkRole = (req, res) => {
  //訪客
  if (!req.user) {
    return res.json({
      success: true,
      user: null,
    });
  }
  //admin
  return res.json({
    success: true,
    user: { role: req.user.role, userName: req.user.userName },
  });
};
