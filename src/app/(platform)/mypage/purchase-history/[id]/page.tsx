import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "@/config/react-query/query-client";
import { PurchaseDetailContent } from "./_components/purchase-detail-content";
import { orderQueryOptions } from "@/hooks/apis/orders/use-order";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PurchaseDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(orderQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PurchaseDetailContent orderId={id} />
    </HydrationBoundary>
  );
}
