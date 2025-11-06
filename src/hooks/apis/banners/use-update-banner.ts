import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Banner, UpdateBannerInput } from "@/shared/types/banner.type";

export const useUpdateBanner = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Banner, Error, UpdateBannerInput>({
    mutationFn: async (data) => {
      return kyClient.put(`api/banners/${id}`, { json: data }).json<Banner>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner", id] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
