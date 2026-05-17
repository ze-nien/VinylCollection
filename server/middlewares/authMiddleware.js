import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = new Error("拒絕存取：請先登入");
    res.statusCode = 401;
    return next(error);
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    next(e);
  }
};

export default verifyAdmin;
