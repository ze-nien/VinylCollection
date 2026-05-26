import { z } from "zod";

export declare const wishListSchema: z.ZodObject<{
  album: z.ZodString;
  artist: z.ZodString;
  notes: z.ZodOptional<z.ZodString>;
  isAcquired: z.ZodBoolean;
  version: z.ZodString;
  year: z.ZodNumber;
  coverUrl: z.ZodOptional<z.ZodString>;
}>;
