import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Display, UpdateDisplayInput } from "@/shared/types/display.type";

export const useUpdateDisplay = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Display, Error, UpdateDisplayInput>({
    mutationFn: async (data) => {
      return kyClient
        .put(`displays/${id}`, { json: data })
        .json<Display>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["display", id] });
      queryClient.invalidateQueries({ queryKey: ["displays"] });
    },
  });
};
