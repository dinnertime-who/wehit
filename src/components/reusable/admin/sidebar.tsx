"use client";

import {
  Briefcase,
  ChevronUp,
  Image,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Megaphone,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/apis/auth/use-auth";
import { useSession } from "@/hooks/apis/auth/use-session";
import { Logo } from "../logo";

const navItems = [
  {
    group: "개요 (Overview)",
    items: [
      {
        label: "대시보드",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "관리 (Users)",
    items: [
      {
        label: "사용자 관리",
        href: "/admin/users",
        icon: Users,
      },
    ],
  },
  {
    group: "컨텐츠 관리 (Contents)",
    items: [
      {
        label: "서비스",
        href: "/admin/services",
        icon: Briefcase,
      },
      {
        label: "리뷰",
        href: "/admin/reviews",
        icon: Star,
      },
      {
        label: "디스플레이",
        href: "/admin/displays",
        icon: LayoutGrid,
      },
      {
        label: "배너",
        href: "/admin/banners",
        icon: Image,
      },
      {
        label: "공지사항",
        href: "/admin/notices",
        icon: Megaphone,
      },
    ],
  },
  {
    group: "시스템 (System)",
    items: [
      {
        label: "설정",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="flex items-center gap-2 my-2">
        <Logo />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <a href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarSeparator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-3">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt={session?.user?.name} />
                    <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                      {session?.user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {session?.user?.name || "Admin"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {session?.user?.email || "admin@wehit.com"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <DropdownMenuItem asChild>
                  <a href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>설정</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut.mutateAsync()}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
