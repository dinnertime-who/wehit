import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { Service, CreateServiceDTO } from "@/shared/types/service.type";

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, CreateServiceDTO>({
    mutationFn: async (data) => {
      return kyClient.post("services", { json: data }).json<Service>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
