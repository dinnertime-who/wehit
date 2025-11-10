import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { UsersDataTable } from "@/components/reusable/admin/users/users-data-table";
import { makeQueryClient } from "@/config/react-query/query-client";
import { adminUsersQueryOptions } from "@/hooks/apis/admin/use-admin-users";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(adminUsersQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
          <p className="text-sm text-muted-foreground mt-2">
            사용자 목록을 보고 관리할 수 있습니다
          </p>
        </div>
        <UsersDataTable />
      </section>
    </HydrationBoundary>
  );
}
