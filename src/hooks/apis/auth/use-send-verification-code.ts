import { useMutation } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";

export type SendVerificationCodeResponse = {
  success: boolean;
  message: string;
};

export const useSendVerificationCode = () => {
  return useMutation<SendVerificationCodeResponse, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      return kyClient
        .post("auth/send-verification-code", { json: { email } })
        .json<SendVerificationCodeResponse>();
    },
  });
};

