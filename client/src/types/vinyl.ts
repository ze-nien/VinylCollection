import { z } from "zod";
import { GENRES } from "../../../shared/constants";
// import { vinylSchema } from "../../../shared/vinylSchema.js";

export const vinylSchema = z.object({
  album: z.string(),
  artist: z.string(),
  genre: z.array(z.enum(GENRES)).optional(), // 如果有固定流派，可以寫 z.enum(["Rock", "Jazz"])
  coverUrl: z.string().optional(),
  version: z.string(),
  year: z.number(),
  albumRating: z.number(),
  notes: z.string().optional(),
});

export type VinylBase = z.infer<typeof vinylSchema>;

export interface Vinyl extends VinylBase {
  _id: string;
}
