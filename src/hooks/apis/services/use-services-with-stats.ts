import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { ServiceWithReviewStats } from "@/shared/types/display.type";

export const servicesWithStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["services", "withStats"] as const,
    queryFn: async () => {
      return kyClient
        .get("services", { searchParams: { withStats: "true" } })
        .json<ServiceWithReviewStats[]>();
    },
  });

export const useServicesWithStats = () => {
  return useSuspenseQuery(servicesWithStatsQueryOptions());
};

