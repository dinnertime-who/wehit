import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { ServiceWithReviewStats } from "@/shared/types/display.type";

export type ServicesWithStatsParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
};

export type ServicesWithStatsResponse = {
  data: ServiceWithReviewStats[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const servicesWithStatsQueryOptions = (
  params: ServicesWithStatsParams = {},
) =>
  queryOptions({
    queryKey: ["services", "withStats", params] as const,
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        withStats: "true",
        ...(params.page && { page: params.page.toString() }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.category && { category: params.category }),
        ...(params.search && { search: params.search }),
      });

      return kyClient
        .get(`services?${searchParams.toString()}`)
        .json<ServicesWithStatsResponse>();
    },
  });

export const useServicesWithStats = (params: ServicesWithStatsParams = {}) => {
  return useSuspenseQuery(servicesWithStatsQueryOptions(params));
};

