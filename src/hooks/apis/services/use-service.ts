import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { ServiceWithPrice } from "@/shared/types/service.type";

export const serviceQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["service", id] as const,
    queryFn: async () => {
      return kyClient.get(`services/${id}`).json<ServiceWithPrice>();
    },
  });

export const useService = (id: string) => {
  return useSuspenseQuery(serviceQueryOptions(id));
};
