import ky from "ky";
import { publicEnv } from "@/config/env";

export const kyClient = ky.create({
  prefixUrl: publicEnv.NEXT_PUBLIC_API_URL,
});
