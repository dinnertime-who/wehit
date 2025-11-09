import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BannersDataTable } from "@/components/reusable/admin/banners/banners-data-table";
import { makeQueryClient } from "@/config/react-query/query-client";
import { bannersQueryOptions } from "@/hooks/apis/banners/use-banners";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const queryClient = makeQueryClient();
  await queryClient.ensureQueryData(bannersQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">배너 관리</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            배너 목록을 보고 관리할 수 있습니다
          </p>
        </div>
        <BannersDataTable />
      </div>
    </HydrationBoundary>
  );
}
