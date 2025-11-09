import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Service } from "@/shared/types/service.type";

export const servicesQueryOptions = () =>
  queryOptions({
    queryKey: ["services"] as const,
    queryFn: async () => {
      return kyClient.get("services").json<Service[]>();
    },
  });

export const useServices = () => {
  return useSuspenseQuery(servicesQueryOptions());
};
