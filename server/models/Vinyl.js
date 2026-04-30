import mongoose from "mongoose";

const VinylSchema = new mongoose.Schema({
  album: { type: String, required: true },
  artist: { type: String, required: true },
  genre: [{ type: String, lowercase: true, trim: true }],
  coverUrl: String,
  year: String,
  tracks: [{ id: Number, title: String, duration: String }],
  comment: String,
  rating: {
    albumRating: Number,
    trackRatings: [{ trackId: Number, score: Number }],
  },
});

const Vinyl = mongoose.model("vinyl", VinylSchema);
export default Vinyl;
