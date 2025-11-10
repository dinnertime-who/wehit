import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReviewsDataTable } from "@/components/reusable/admin/reviews/reviews-data-table";
import { makeQueryClient } from "@/config/react-query/query-client";
import { adminReviewsQueryOptions } from "@/hooks/apis/admin/use-admin-reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(adminReviewsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">리뷰 관리</h1>
          <p className="text-sm text-muted-foreground mt-2">
            리뷰 목록을 보고 관리할 수 있습니다
          </p>
        </div>
        <ReviewsDataTable />
      </section>
    </HydrationBoundary>
  );
}
