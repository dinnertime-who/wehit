import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DisplaysDataTable } from "@/components/reusable/admin/displays/displays-data-table";
import { makeQueryClient } from "@/config/react-query/query-client";
import { displaysQueryOptions } from "@/hooks/apis/displays/use-displays";

export const dynamic = "force-dynamic";

export default async function AdminDisplaysPage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(displaysQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">디스플레이 관리</h1>
          <p className="text-sm text-muted-foreground mt-2">
            디스플레이 목록을 보고 관리할 수 있습니다
          </p>
        </div>
        <DisplaysDataTable />
      </section>
    </HydrationBoundary>
  );
}
