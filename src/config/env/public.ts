import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_URL: z.url(),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_IMAGE_HOST: z.url(),
  NEXT_PUBLIC_SITE_NAME: z.string(),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_IMAGE_HOST: process.env.NEXT_PUBLIC_IMAGE_HOST,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "위힛",
});
