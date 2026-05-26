const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.status ||
    err.statusCode ||
    (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message;
  console.log(`error${statusCode} message:${message}`);

  if (err.code === 11000 || err.status === 409 || err.statusCode === 409) {
    statusCode = 409;

    if (err.code === 11000) {
      const duplicateField = err.keyValue ? Object.keys(err.keyValue)[0] : "";
      message = duplicateField
        ? `此規格的資料已存在（重複的欄位：${duplicateField}）`
        : "資料庫中已存在相同的資料，請勿重複新增";
    } else {
      message = err.message;
    }
  }

  //zod表單驗證錯誤
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.issues?.[0]?.message || "欄位驗證失敗";
  }

  //MongoDB Mongoose格式錯誤
  if (err.name === "CastError") {
    statusCode = 400;
    message = "無效的 ID 格式";
  }

  //伺服器錯誤5xx保留列印
  if (statusCode >= 500) {
    console.error(
      `💥 [${statusCode} 嚴重錯誤] ${req.method} ${req.url} -> ${message}`,
    );
    console.error(err.stack);
  } else {
    //4xx錯誤只在開發環境列印
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `⚠️ [${statusCode} 業務攔疑] ${req.method} ${req.url} -> 原因：${message}`,
      );
    }
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
