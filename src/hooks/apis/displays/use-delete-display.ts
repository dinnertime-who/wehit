import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export const useDeleteDisplay = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await kyClient.delete(`displays/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displays"] });
    },
  });
};
