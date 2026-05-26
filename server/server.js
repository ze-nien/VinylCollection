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
app.use(
  cors({
    //指定前端網址
    origin: "http://localhost:5173",
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
