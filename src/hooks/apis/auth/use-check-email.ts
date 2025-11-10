import { useQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import { useEffect, useState } from "react";

export type CheckEmailResponse = {
  available: boolean;
  email: string;
};

export const useCheckEmail = (email: string, enabled: boolean = true) => {
  const [debouncedEmail, setDebouncedEmail] = useState(email);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(email);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [email]);

  return useQuery<CheckEmailResponse, Error>({
    queryKey: ["check-email", debouncedEmail],
    queryFn: async () => {
      if (!debouncedEmail) {
        throw new Error("Email is required");
      }
      return kyClient
        .get("auth/check-email", { searchParams: { email: debouncedEmail } })
        .json<CheckEmailResponse>();
    },
    enabled: enabled && debouncedEmail.length > 0,
    retry: false,
  });
};

