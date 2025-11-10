import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "@/config/react-query/query-client";
import { PurchaseHistoryContent } from "./_components/purchase-history-content";
import { ordersQueryOptions } from "@/hooks/apis/orders/use-orders";

export const dynamic = "force-dynamic";

export default async function PurchaseHistoryPage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(ordersQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PurchaseHistoryContent />
    </HydrationBoundary>
  );
}
