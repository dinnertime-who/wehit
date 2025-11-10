import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Service } from "@/shared/types/service.type";

export const servicesQueryOptions = () =>
  queryOptions({
    queryKey: ["services"] as const,
    queryFn: async () => {
      return kyClient
        .get("services")
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

export const useServices = () => {
  return useSuspenseQuery(servicesQueryOptions());
};
