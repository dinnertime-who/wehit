import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/config/react-query/query-client";
import { servicesWithStatsQueryOptions } from "@/hooks/apis/services/use-services-with-stats";
import { ServicesPageContent } from "./_components/services-page-content";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: Props) {
  const queryClient = makeQueryClient();
  const params = await searchParams;

  await queryClient.ensureQueryData(
    servicesWithStatsQueryOptions({
      page: params.page ? parseInt(params.page, 10) : 1,
      limit: 12,
      category: params.category,
      search: params.search,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServicesPageContent />
    </HydrationBoundary>
  );
}
