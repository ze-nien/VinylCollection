import jwt from "jsonwebtoken";

//解析身份
export const parseUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    req.user = null;
    next();
  }
};

//必須是admin
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    const e = new Error("拒絕存取，請先登入");
    e.status = 401;
    return next(e);
  }
  const currentUA = req.headers["user-agent"];
  if (req.user.ua !== currentUA) {
    const e = new Error("憑證異常，拒絕存取");
    e.status = 403;
    return next(e);
  }
  next();
};
