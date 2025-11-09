import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export const useRemoveDisplayService = (displayId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { serviceId: string }>({
    mutationFn: async ({ serviceId }) => {
      await kyClient.delete(`displays/${displayId}/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["display", displayId] });
    },
  });
};
