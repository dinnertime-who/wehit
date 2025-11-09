import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Service, UpdateServiceDTO } from "@/shared/types/service.type";

export const useUpdateService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, UpdateServiceDTO>({
    mutationFn: async (data) => {
      return kyClient.put(`services/${id}`, { json: data }).json<Service>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", id] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
