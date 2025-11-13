import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { ReorderDisplayServicesInput } from "@/shared/types/display.type";

export const useReorderDisplayServices = (displayId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Omit<ReorderDisplayServicesInput, "displayId">>({
    mutationFn: async (data) => {
      await kyClient.patch(`displays/${displayId}/services/reorder`, {
        json: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["display", displayId] });
    },
  });
};

