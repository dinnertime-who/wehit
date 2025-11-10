import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "@/config/react-query/query-client";
import { OrderCompleteContent } from "./_components/order-complete-content";
import { orderQueryOptions } from "@/hooks/apis/orders/use-order";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function OrderCompletePage({ searchParams }: Props) {
  const queryClient = makeQueryClient();
  const params = await searchParams;

  if (params.orderId) {
    await queryClient.ensureQueryData(orderQueryOptions(params.orderId));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderCompleteContent />
    </HydrationBoundary>
  );
}
