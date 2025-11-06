import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Banner, CreateBannerInput } from "@/shared/types/banner.type";

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<Banner, Error, CreateBannerInput>({
    mutationFn: async (data) => {
      return kyClient.post("banners", { json: data }).json<Banner>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
