import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Display, CreateDisplayInput } from "@/shared/types/display.type";

export const useCreateDisplay = () => {
  const queryClient = useQueryClient();

  return useMutation<Display, Error, CreateDisplayInput>({
    mutationFn: async (data) => {
      return kyClient
        .post("displays", { json: data })
        .json<Display>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displays"] });
    },
  });
};
