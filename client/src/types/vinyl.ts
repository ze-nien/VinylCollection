import { z } from "zod";
import { vinylSchema } from "../../../shared/vinylSchema.js";

export type VinylBase = z.infer<typeof vinylSchema>;

export interface Vinyl extends VinylBase {
  _id: string;
}
