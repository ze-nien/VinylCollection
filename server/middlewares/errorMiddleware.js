const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  console.log(`error${statusCode} message:${message}`);
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.issues?.[0]?.message || "欄位驗證失敗";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "無效的 ID 格式";
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
