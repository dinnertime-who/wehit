import { queryOptions, useQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Order } from "@/shared/types/order.type";

export const ordersQueryOptions = () => ({
  queryKey: ["orders"] as const,
  queryFn: async (): Promise<Order[]> => {
    return kyClient.get("orders").json<Order[]>();
  },
});

export const useOrders = () => {
  return useQuery(ordersQueryOptions());
};

