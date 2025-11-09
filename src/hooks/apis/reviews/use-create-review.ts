import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Review, CreateReviewDTO } from "@/shared/types/review.type";

export const useCreateReview = (serviceId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, Omit<CreateReviewDTO, "serviceId">>({
    mutationFn: async (data) => {
      return kyClient.post(`services/${serviceId}/reviews`, { json: data }).json<Review>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", serviceId] });
    },
  });
};
