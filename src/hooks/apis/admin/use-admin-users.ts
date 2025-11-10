import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { user } from "@/infrastructure/db/schema";

export type User = typeof user.$inferSelect;

export const adminUsersQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "users"] as const,
    queryFn: async () => {
      return kyClient.get("admin/users").json<User[]>();
    },
  });

export const useAdminUsers = () => {
  return useSuspenseQuery(adminUsersQueryOptions());
};

