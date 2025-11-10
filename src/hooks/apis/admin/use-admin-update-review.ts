import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Review, UpdateReviewDTO } from "@/shared/types/review.type";

export const useAdminUpdateReview = (reviewId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, UpdateReviewDTO>({
    mutationFn: async (data) => {
      return kyClient.put(`reviews/${reviewId}`, { json: data }).json<Review>();
    },
    onSuccess: () => {
      // Admin reviews 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      // 개별 리뷰 쿼리도 무효화 (serviceId는 모르므로 전체 무효화)
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

