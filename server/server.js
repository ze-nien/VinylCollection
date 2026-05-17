import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import AuthRouter from "./routes/authRoutes.js";
import VinylRouter from "./routes/vinylRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";

dotenv.config();
const app = express();
app.use(cors());
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
