import mongoose from "mongoose";
import { GENRES } from "../types/constants.js";

const VinylSchema = new mongoose.Schema(
  {
    album: { type: String, required: true },
    artist: { type: String, required: true },
    genre: { type: [String], enum: GENRES, default: [] },
    version: { type: String, default: "Standard" },
    year: { type: String, required: true },
    coverUrl: String,
    coverSource: String,
    albumRating: Number,
    notes: {
      type: String,
      maxlength: [100, "備註內容不能超過 100 個字"], // 自訂錯誤訊息
      trim: true, //前後空格
    },
  },
  {
    timestamps: true,
  },
);

const Vinyl = mongoose.model("vinyl", VinylSchema);
export default Vinyl;
