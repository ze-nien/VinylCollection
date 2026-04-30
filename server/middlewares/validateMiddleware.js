const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      //parse方法驗證輸入內容
      body: req.body, //傳送資料內容
      query: req.query, //網址?後的參數
      params: req.params, //網址/後的參數
    });
    // 驗證後的資料覆蓋回去，確保後面的 Controller 拿到的資料是乾淨的
    Object.assign(req.body, validatedData.body);
    Object.assign(req.query, validatedData.query);
    Object.assign(req.params, validatedData.params);

    next(); //成功後進入下一個middleware/controller
  } catch (e) {
    next(e); //發生錯誤進入error middleware
  }
};

export default validate;
