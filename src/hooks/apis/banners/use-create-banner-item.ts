import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type {
  BannerItem,
  CreateBannerItemInput,
} from "@/shared/types/banner.type";

export const useCreateBannerItem = (bannerId: string) => {
  const queryClient = useQueryClient();

  return useMutation<BannerItem, Error, CreateBannerItemInput>({
    mutationFn: async (data) => {
      return kyClient.post(`api/banners/${bannerId}/items`, { json: data }).json<BannerItem>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
    },
  });
};
