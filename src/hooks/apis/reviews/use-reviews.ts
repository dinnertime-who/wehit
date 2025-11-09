import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Review } from "@/shared/types/review.type";

export const reviewsQueryOptions = (serviceId: string) =>
  queryOptions({
    queryKey: ["reviews", serviceId] as const,
    queryFn: async () => {
      return kyClient.get(`services/${serviceId}/reviews`).json<Review[]>();
    },
  });

export const useReviews = (serviceId: string) => {
  return useSuspenseQuery(reviewsQueryOptions(serviceId));
};
