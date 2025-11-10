import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/client";
import type { OAuthProvider } from "@/shared/types/oauth-provider.type";
import { sessionQueryOptions } from "./use-session";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const oauth = useMutation({
    mutationFn: (provider: OAuthProvider) => {
      return authClient.signIn.social({ provider });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryOptions.queryKey });
    },
  });

  const emailPassword = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return authClient.signIn.email({ email, password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryOptions.queryKey });
    },
  });

  const signUpEmail = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      return authClient.signUp.email({ email, password, name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryOptions.queryKey });
    },
  });

  const signOut = useMutation({
    mutationFn: () => {
      return authClient.signOut();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryOptions.queryKey });
    },
  });

  return {
    oauth,
    emailPassword,
    signUpEmail,
    signOut,
  };
};
