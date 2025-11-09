import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ServicesDataTable } from "@/components/reusable/admin/services/services-data-table";
import { makeQueryClient } from "@/config/react-query/query-client";
import { servicesQueryOptions } from "@/hooks/apis/services/use-services";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const queryClient = makeQueryClient();
  await queryClient.ensureQueryData(servicesQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">서비스 관리</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            서비스 목록을 보고 관리할 수 있습니다
          </p>
        </div>
        <ServicesDataTable />
      </div>
    </HydrationBoundary>
  );
}
