import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MyPageContent } from "./_components/mypage-content";
import { makeQueryClient } from "@/config/react-query/query-client";
import { sessionQueryOptions } from "@/hooks/apis/auth/use-session";

export const dynamic = "force-dynamic";

export default async function MyPagePage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(sessionQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPageContent />
    </HydrationBoundary>
  );
}
