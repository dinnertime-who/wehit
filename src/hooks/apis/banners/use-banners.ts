import { queryOptions, useQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Banner } from "@/shared/types/banner.type";

export const bannersQueryOptions = queryOptions({
  queryKey: ["banners"] as const,
  queryFn: async () => {
    return kyClient.get("api/banners").json<Banner[]>();
  },
});

export const useBanners = () => {
  return useQuery(bannersQueryOptions);
};
