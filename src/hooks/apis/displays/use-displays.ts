import { queryOptions, useQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Display } from "@/shared/types/display.type";

export const displaysQueryOptions = queryOptions({
  queryKey: ["displays"] as const,
  queryFn: async () => {
    return kyClient.get("displays").json<Display[]>();
  },
});

export const useDisplays = () => {
  return useQuery(displaysQueryOptions);
};
