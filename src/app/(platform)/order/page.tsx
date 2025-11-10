import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "@/config/react-query/query-client";
import { OrderPageContent } from "./_components/order-page-content";
import { serviceQueryOptions } from "@/hooks/apis/services/use-service";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ serviceId?: string }>;
};

export default async function OrderPage({ searchParams }: Props) {
  const queryClient = makeQueryClient();
  const params = await searchParams;

  if (params.serviceId) {
    await queryClient.ensureQueryData(serviceQueryOptions(params.serviceId));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderPageContent />
    </HydrationBoundary>
  );
}
