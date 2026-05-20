import { z } from "zod";

export declare const vinylSchema: z.ZodObject<{
  album: z.ZodString;
  artist: z.ZodString;
  genre: z.ZodOptional<z.ZodArray<z.ZodEnum<[string, ...string[]]>>>;
  coverUrl: z.ZodOptional<z.ZodString>;
  year: z.ZodOptional<z.ZodNumber>;
  albumRating: z.ZodNumber;
  notes: z.ZodOptional<z.ZodString>;
}>;
