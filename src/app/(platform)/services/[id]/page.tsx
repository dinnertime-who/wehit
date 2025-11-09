import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { ServiceDetailPage as ServiceDetailPageContent } from "./_components/service-detail-page";
import { makeQueryClient } from "@/config/react-query/query-client";
import { serviceQueryOptions } from "@/hooks/apis/services/use-service";
import { reviewsQueryOptions } from "@/hooks/apis/reviews/use-reviews";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  // Prefetch service data
  const service = await queryClient.ensureQueryData(
    serviceQueryOptions(id)
  );

  if (!service) {
    notFound();
  }

  // Prefetch reviews data
  await queryClient.ensureQueryData(
    reviewsQueryOptions(id)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServiceDetailPageContent serviceId={id} />
    </HydrationBoundary>
  );
}
