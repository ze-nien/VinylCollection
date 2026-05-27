import mongoose from "mongoose";

const WishListSchema = new mongoose.Schema(
  {
    album: { type: String, required: true },
    artist: { type: String, required: true },
    notes: {
      type: String,
      maxlength: [100, "備註內容不能超過 100 個字"], // 自訂資料庫錯誤訊息
      trim: true, // 前後空格
    },
    isAcquired: { type: Boolean, default: false },
    version: { type: String, default: "" },
    year: { type: String, required: true },
    coverUrl: String,
    coverSource: String,
  },
  { timestamps: true },
);

const WishList = mongoose.model("wishlist", WishListSchema);
export default WishList;
