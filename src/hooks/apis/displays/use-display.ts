import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { DisplayWithServices } from "@/shared/types/display.type";

export const displayQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["display", id] as const,
    queryFn: async () => {
      return kyClient.get(`displays/${id}`).json<DisplayWithServices>();
    },
  });

export const useDisplay = (id: string) => {
  return useSuspenseQuery(displayQueryOptions(id));
};
