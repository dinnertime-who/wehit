import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Review } from "@/shared/types/review.type";

export const adminReviewsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "reviews"] as const,
    queryFn: async () => {
      return kyClient.get("admin/reviews").json<Review[]>();
    },
  });

export const useAdminReviews = () => {
  return useSuspenseQuery(adminReviewsQueryOptions());
};

