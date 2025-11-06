import type { MetadataRoute } from "next";
import { publicEnv } from "@/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: publicEnv.NEXT_PUBLIC_URL,
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
