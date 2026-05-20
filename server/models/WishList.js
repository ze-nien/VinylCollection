import mongoose from "mongoose";

const WishListSchema = new mongoose.Schema(
  {
    album: { type: String, required: true },
    artist: { type: String, required: true },
    notes: {
      type: String,
      maxlength: [200, "備註內容不能超過 200 個字"], // 自訂資料庫錯誤訊息
      trim: true, // 前後空格
    },
    isAcquired: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const WishList = mongoose.model("wishlist", WishListSchema);
export default WishList;
