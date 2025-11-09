import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Review, UpdateReviewDTO } from "@/shared/types/review.type";

export const useUpdateReview = (reviewId: string, serviceId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, UpdateReviewDTO>({
    mutationFn: async (data) => {
      return kyClient.put(`reviews/${reviewId}`, { json: data }).json<Review>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", serviceId] });
    },
  });
};
