import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export const useDeleteBannerItem = (itemId: string, bannerId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await kyClient.delete(`api/banners/items/${itemId}`);
    },
    onSuccess: () => {
      if (bannerId) {
        queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
      }
    },
  });
};
