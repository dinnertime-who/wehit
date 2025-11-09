import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { BannerWithItems } from "@/shared/types/banner.type";

export const bannerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["banner", id] as const,
    queryFn: async () => {
      return kyClient.get(`banners/${id}`).json<BannerWithItems>();
    },
  });

export const useBanner = (id: string) => {
  return useSuspenseQuery(bannerQueryOptions(id));
};
