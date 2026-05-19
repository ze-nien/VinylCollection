import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import AuthRouter from "./routes/authRoutes.js";
import VinylRouter from "./routes/vinylRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";

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
app.use(cookieParser());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("連接mongoDB.."))
  .catch((e) => console.error(e));

app.use("/api/auth", AuthRouter);
app.use("/api/vinyls", VinylRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listen on port ${PORT}...`));
