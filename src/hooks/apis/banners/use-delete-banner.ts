import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export const useDeleteBanner = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await kyClient.delete(`banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner", id] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};
