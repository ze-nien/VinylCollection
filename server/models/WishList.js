import mongoose from "mongoose";

const WishListSchema = new mongoose.Schema({
  album: { type: String, required: true },
  artist: { type: String, required: true },
  genre: [String],
  coverUrl: String,
  isAcquired: { type: boolean, default: false },
});

const WishList = mongoose.model("wishlist", WishListSchema);
export default WishList;
