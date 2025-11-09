import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type {
  DisplayServiceRecord,
  AddServiceToDisplayInput,
} from "@/shared/types/display.type";

export const useAddDisplayService = (displayId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    DisplayServiceRecord,
    Error,
    Omit<AddServiceToDisplayInput, "displayId">
  >({
    mutationFn: async (data) => {
      return kyClient
        .post(`displays/${displayId}/services`, { json: data })
        .json<DisplayServiceRecord>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["display", displayId] });
    },
  });
};
