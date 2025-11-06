import { queryOptions, useQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Banner } from "@/shared/types/banner.type";

export const bannerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["banner", id] as const,
    queryFn: async () => {
      return kyClient.get(`api/banners/${id}`).json<Banner>();
    },
  });

export const useBanner = (id: string) => {
  return useQuery(bannerQueryOptions(id));
};
