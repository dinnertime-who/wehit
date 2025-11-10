import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export type AdminStats = {
  serviceCount: number;
  reviewCount: number;
  userCount: number;
  noticeCount: number;
};

export const adminStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "stats"] as const,
    queryFn: async () => {
      return kyClient.get("admin/stats").json<AdminStats>();
    },
  });

export const useAdminStats = () => {
  return useSuspenseQuery(adminStatsQueryOptions());
};

