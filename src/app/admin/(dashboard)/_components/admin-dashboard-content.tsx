"use client";

import { useAdminStats } from "@/hooks/apis/admin/use-admin-stats";

export function AdminDashboardContent() {
  const { data: stats } = useAdminStats();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-sm text-muted-foreground mt-2">
          전체 통계를 한눈에 확인할 수 있습니다
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            총 사용자
          </div>
          <div className="mt-2 text-2xl font-bold">
            {stats.userCount.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            총 서비스
          </div>
          <div className="mt-2 text-2xl font-bold">
            {stats.serviceCount.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            총 리뷰
          </div>
          <div className="mt-2 text-2xl font-bold">
            {stats.reviewCount.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            공지사항
          </div>
          <div className="mt-2 text-2xl font-bold">
            {stats.noticeCount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

