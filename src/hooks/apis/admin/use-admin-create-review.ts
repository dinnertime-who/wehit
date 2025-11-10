import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Review, CreateReviewDTO } from "@/shared/types/review.type";

export const useAdminCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, CreateReviewDTO>({
    mutationFn: async (data) => {
      return kyClient
        .post(`services/${data.serviceId}/reviews`, { json: data })
        .json<Review>();
    },
    onSuccess: () => {
      // Admin reviews 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      // 개별 리뷰 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

