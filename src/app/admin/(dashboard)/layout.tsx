import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdminHeader } from "@/components/reusable/admin/header";
import { AdminSidebar } from "@/components/reusable/admin/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { makeQueryClient } from "@/config/react-query/query-client";
import { sessionQueryOptions } from "@/hooks/apis/auth/use-session";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: 세션 체크 및 권한 검증 추가 (admin role 확인)
  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery(sessionQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-4 overflow-auto p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
