import { queryOptions, useQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { OrderWithItems } from "@/shared/types/order.type";

export const orderQueryOptions = (id: string) => ({
  queryKey: ["orders", id] as const,
  queryFn: async (): Promise<OrderWithItems> => {
    return kyClient.get(`orders/${id}`).json<OrderWithItems>();
  },
});

export const useOrder = (id: string) => {
  return useQuery(orderQueryOptions(id));
};

