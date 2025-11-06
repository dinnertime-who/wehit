import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Header } from "@/components/reusable/platform/header";
import { makeQueryClient } from "@/config/react-query/query-client";
import { sessionQueryOptions } from "@/hooks/apis/auth/use-session";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery(sessionQueryOptions);

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header />
      </HydrationBoundary>
      <main>{children}</main>
    </div>
  );
}
