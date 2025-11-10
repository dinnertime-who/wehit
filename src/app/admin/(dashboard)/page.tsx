import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdminDashboardContent } from "./_components/admin-dashboard-content";
import { makeQueryClient } from "@/config/react-query/query-client";
import { adminStatsQueryOptions } from "@/hooks/apis/admin/use-admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(adminStatsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent />
    </HydrationBoundary>
  );
}
