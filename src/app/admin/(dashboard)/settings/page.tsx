import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { makeQueryClient } from "@/config/react-query/query-client";
import { SettingsContent } from "./_components/settings-content";
import { siteSettingQueryOptions } from "@/hooks/apis/site-settings/use-site-setting";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const queryClient = makeQueryClient();

  // Prefetch site-account setting
  await queryClient.ensureQueryData(siteSettingQueryOptions("site-account"));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-sm text-muted-foreground mt-2">
          시스템 설정을 관리합니다
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SettingsContent />
      </HydrationBoundary>
    </div>
  );
}
