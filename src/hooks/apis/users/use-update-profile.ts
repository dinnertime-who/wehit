import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import { sessionQueryOptions } from "../auth/use-session";

type UpdateProfileDTO = {
  phone: string;
  birthDate: string;
  gender: "male" | "female" | "other";
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDTO) => {
      const response = await kyClient.put("users/profile", { json: data });
      return response.json();
    },
    onSuccess: () => {
      // 세션 정보도 무효화하여 최신 사용자 정보를 가져오도록 함
      queryClient.invalidateQueries({
        queryKey: sessionQueryOptions.queryKey,
      });
    },
  });
}

