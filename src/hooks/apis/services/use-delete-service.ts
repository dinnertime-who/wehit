import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export const useDeleteService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await kyClient.delete(`services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", id] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
