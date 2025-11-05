import { queryOptions, useQuery } from "@tanstack/react-query";
import { getSessionAction } from "@/lib/auth/actions";

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"] as const,
  queryFn: () => getSessionAction(),
});

export const useSession = () => {
  return useQuery(sessionQueryOptions);
};
