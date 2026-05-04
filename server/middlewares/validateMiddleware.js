const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      //parse方法驗證輸入內容
      body: req.body, //傳送資料內容
      query: req.query, //網址?後的參數
      params: req.params, //網址/後的參數
    });
    // 驗證後的資料覆蓋回去(先檢查存在)，確保後面的 Controller 拿到的資料是乾淨的
    if (validatedData.body) Object.assign(req.body, validatedData.body);
    if (validatedData.query) Object.assign(req.query, validatedData.query);
    if (validatedData.params) Object.assign(req.params, validatedData.params);
    next(); //成功後進入下一個middleware/controller
  } catch (e) {
    next(e); //發生錯誤進入error middleware
  }
};

export default validate;
