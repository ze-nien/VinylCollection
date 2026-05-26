import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import AuthRouter from "./routes/authRoutes.js";
import VinylRouter from "./routes/vinylRoutes.js";
import WishListRouter from "./routes/wishListRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";

import WishList from "./models/WishList.js";
import Vinyl from "./models/Vinyl.js";

dotenv.config();
console.log(`伺服器運行模式：[${process.env.NODE_ENV}]`);
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://vinyl-collection-liard.vercel.app",
];

app.use(
  cors({
    //指定前端網址
    origin: function (origin, callback) {
      // 允許沒有 origin 的請求（例如本地 Postman 測試、行動裝置 App 等）
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS 策略不允許此網域存取"));
      }
    },
    //允許前端跨域攜帶 Cookie / 憑證
    credentials: true,
    //允許常見的 HTTP 方法與 Headers
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options(/.*/, cors());
app.use(cookieParser());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI_ATLAS;

const migrateOldData = async () => {
  try {
    const vinylResult = await Vinyl.updateMany(
      {
        version: "",
      },
      { $set: { version: "Standard" } },
    );
    const wishResult = await WishList.updateMany(
      {
        version: { $exists: false },
      },
      { $set: { version: "" } },
    );
    console.log(
      `成功更新vinyl${vinylResult.modifiedCount}筆 wish${wishResult.modifiedCount}筆`,
    );
  } catch (error) {
    console.error(error);
  }
};

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("連接mongoDB..");
    // migrateOldData();
  })
  .catch((e) => console.error(e));

app.use("/api/auth", AuthRouter);
app.use("/api/vinyls", VinylRouter);
app.use("/api/wishList", WishListRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listen on port ${PORT}...`));
