import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type {
  BannerItem,
  UpdateBannerItemInput,
} from "@/shared/types/banner.type";

export const useUpdateBannerItem = (itemId: string, bannerId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<BannerItem, Error, UpdateBannerItemInput>({
    mutationFn: async (data) => {
      return kyClient
        .put(`banners/items/${itemId}`, { json: data })
        .json<BannerItem>();
    },
    onSuccess: () => {
      if (bannerId) {
        queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
      }
    },
  });
};
