import mongoose from "mongoose";
import { GENRES } from "../../shared/constants.js";

const VinylSchema = new mongoose.Schema(
  {
    album: { type: String, required: true },
    artist: { type: String, required: true },
    genre: [{ type: String, enum: GENRES }],
    coverUrl: String,
    year: String,
    albumRating: Number,
    notes: {
      type: String,
      maxlength: [200, "備註內容不能超過 200 個字"], // 自訂錯誤訊息
      trim: true, //前後空格
    },
  },
  {
    timestamps: true,
  },
);

const Vinyl = mongoose.model("vinyl", VinylSchema);
export default Vinyl;
