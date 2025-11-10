import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ServicesPageContent } from "./_components/services-page-content";
import { makeQueryClient } from "@/config/react-query/query-client";
import { servicesWithStatsQueryOptions } from "@/hooks/apis/services/use-services-with-stats";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(servicesWithStatsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServicesPageContent />
    </HydrationBoundary>
  );
}
