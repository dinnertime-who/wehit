import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { DisplayWithServiceDetails } from "@/shared/types/display.type";

export const displayBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["display", "slug", slug] as const,
    queryFn: async () => {
      return kyClient.get(`displays/slug/${slug}`).json<DisplayWithServiceDetails>();
    },
  });

export const useDisplayBySlug = (slug: string) => {
  return useSuspenseQuery(displayBySlugQueryOptions(slug));
};

