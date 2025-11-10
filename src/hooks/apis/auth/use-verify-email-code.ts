import { useMutation } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export type VerifyEmailCodeResponse = {
  success: boolean;
  verified: boolean;
  message: string;
};

export const useVerifyEmailCode = () => {
  return useMutation<
    VerifyEmailCodeResponse,
    Error,
    { email: string; code: string }
  >({
    mutationFn: async ({ email, code }) => {
      return kyClient
        .post("auth/verify-email-code", { json: { email, code } })
        .json<VerifyEmailCodeResponse>();
    },
  });
};

