"use client";

import { LogOut, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/apis/auth/use-auth";
import { useSession } from "@/hooks/apis/auth/use-session";
import { Logo } from "../logo";
import { SearchBar } from "../search-bar";
import { Suspense } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileSidebar({ open, onOpenChange }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { signOut } = useAuth();

  const navItems = [
    {
      label: "서비스 목록",
      href: "/service" as const,
      icon: ShoppingBag,
    },
  ] as const;

  const userNavItems = session
    ? ([
        {
          label: "마이페이지",
          href: "/mypage" as const,
          icon: User,
        },
        {
          label: "구매 내역",
          href: "/mypage/purchase-history" as const,
          icon: ShoppingBag,
        },
      ] as const)
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[18rem] p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>메뉴</SheetTitle>
          <SheetDescription>네비게이션 메뉴</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 border-b px-4 py-4">
            <Logo />
          </div>

          {/* Search Bar (Mobile) */}
          <div className="border-b px-4 py-4">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {userNavItems.length > 0 && (
                <>
                  <Separator className="my-2" />
                  {userNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => onOpenChange(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t px-2 py-4">
            {session ? (
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  signOut.mutateAsync();
                  onOpenChange(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>로그아웃</span>
              </Button>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => onOpenChange(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <User className="h-5 w-5" />
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

