"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pathConfig: Record<string, { label: string; icon: string }> = {
  "/admin": { label: "대시보드", icon: "📊" },
  "/admin/users": { label: "사용자 관리", icon: "👥" },
  "/admin/services": { label: "서비스", icon: "🎯" },
  "/admin/reviews": { label: "리뷰", icon: "⭐" },
  "/admin/banners": { label: "배너", icon: "🖼️" },
  "/admin/notices": { label: "공지사항", icon: "📢" },
  "/admin/settings": { label: "설정", icon: "⚙️" },
};

export const AdminHeader = () => {
  const pathname = usePathname();

  // Find the current page config
  const currentPage =
    pathConfig[pathname] ||
    Object.entries(pathConfig).find(([path]) =>
      pathname.startsWith(`${path}/`),
    )?.[1];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="-ml-1" />

      {/* Divider */}
      <div className="h-6 w-px bg-border" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          관리자
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentPage?.icon || "📋"}</span>
          <h1 className="text-sm font-semibold">
            {currentPage?.label || "페이지"}
          </h1>
        </div>
      </nav>
    </header>
  );
};
