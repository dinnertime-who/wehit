import { queryOptions, useQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { BannerWithItems } from "@/shared/types/banner.type";

export const bannerBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["banner", "slug", slug] as const,
    queryFn: async () => {
      return kyClient.get(`banners/slug/${slug}`).json<BannerWithItems>();
    },
  });

export const useBannerBySlug = (slug: string) => {
  return useQuery(bannerBySlugQueryOptions(slug));
};
