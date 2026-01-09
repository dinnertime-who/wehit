import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Service } from "@/shared/types/service.type";

export const servicesQueryOptions = (page: number = 1, limit: number = 12) =>
  queryOptions({
    queryKey: ["services", page, limit] as const,
    queryFn: async () => {
      return kyClient
        .get("services", {
          searchParams: {
            page: page.toString(),
            limit: limit.toString(),
          },
        })
        .json<{
          data: Service[];
          pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        }>();
    },
  });

export const useServices = (page: number = 1, limit: number = 12) => {
  return useSuspenseQuery(servicesQueryOptions(page, limit));
};
