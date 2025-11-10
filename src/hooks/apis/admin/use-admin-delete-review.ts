import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export const useAdminDeleteReview = (reviewId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await kyClient.delete(`reviews/${reviewId}`);
    },
    onSuccess: () => {
      // Admin reviews 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      // 개별 리뷰 쿼리도 무효화 (serviceId는 모르므로 전체 무효화)
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

