"use client";

import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/apis/auth/use-auth";
import { useSession } from "@/hooks/apis/auth/use-session";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { SearchBar } from "../search-bar";

export const Header = () => {
  const { data: session } = useSession();
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-(--header-height) w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="app-container flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-x-4 w-full">
          <Logo />
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* 우측 액션 버튼 */}
        <div className="flex items-center">
          {!session ? (
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden md:flex font-semibold",
              )}
            >
              로그인
            </Link>
          ) : (
            <>
              <Link
                href="/mypage"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "hidden md:flex font-semibold",
                )}
              >
                마이페이지
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => signOut.mutateAsync()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
