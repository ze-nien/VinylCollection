import mongoose from "mongoose";
import { GENRES } from "../../shared/constants.ts";

const VinylSchema = new mongoose.Schema(
  {
    album: { type: String, required: true },
    artist: { type: String, required: true },
    genre: [{ type: String, enum: GENRES }],
    coverUrl: String,
    year: String,
    albumRating: Number,
    notes: String,
  },
  {
    timestamps: true,
  },
);

const Vinyl = mongoose.model("vinyl", VinylSchema);
export default Vinyl;
