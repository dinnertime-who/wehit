import type { MetadataRoute } from "next";
import { publicEnv } from "@/config/env/public";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      disallow: "*",
    },
    sitemap: `${publicEnv.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
