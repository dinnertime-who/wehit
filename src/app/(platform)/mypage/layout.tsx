import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { makeQueryClient } from "@/config/react-query/query-client";
import { sessionQueryOptions } from "@/hooks/apis/auth/use-session";

export default async function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = makeQueryClient();

  const session = await queryClient.ensureQueryData(sessionQueryOptions);

  if (!session) {
    return redirect("/sign-in");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
