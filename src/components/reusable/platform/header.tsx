"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/apis/auth/use-auth";
import { useSession } from "@/hooks/apis/auth/use-session";
import { useBannerTagStore } from "@/hooks/stores/use-banner-tag.store";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { SearchBar } from "../search-bar";
import { MobileSidebar } from "./mobile-sidebar";

const BANNER_TAGS = [
  {
    label: "전체보기",
    value: null,
  },
  {
    label: "블로그",
    value: "블로그",
  },
  {
    label: "유튜브",
    value: "유튜브",
  },
  {
    label: "인스타그램",
    value: "인스타그램",
  },
  {
    label: "틱톡",
    value: "틱톡",
  },
];
export const Header = () => {
  const { data: session } = useSession();
  const { signOut } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { bannerTag, setBannerTag } = useBannerTagStore();

  return (
    <header className="flex flex-col sticky top-0 z-50 h-(--header-height) w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="app-container flex items-center justify-between px-4 h-14 md:h-20">
        <div className="flex items-center gap-x-4 w-full">
          <Logo />
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* 우측 액션 버튼 */}
        <div className="flex items-center text-[15px] font-medium gap-x-5 break-keep">
          <div className={cn("hidden md:flex")}>엔터프라이즈</div>
          <div className={cn("hidden md:flex")}>마이페이지</div>
          <Link href="/sign-in" className={cn("hidden md:flex")}>
            로그인
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: "default" }),
              "hidden md:flex rounded-full font-bold py-1.5 h-auto text-[14px]",
            )}
          >
            회원가입
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 app-container flex gap-x-8 items-end justify-start text-heading-5 translate-y-px">
        {BANNER_TAGS.map((tag) => (
          <button
            key={tag.value}
            type="button"
            className="py-1.5 cursor-pointer border-b-3 transition-all duration-200 border-transparent hover:border-pink-600 data-[selected=true]:border-pink-600"
            onClick={() => setBannerTag(tag.value)}
            data-selected={bannerTag ? bannerTag === tag.value : false}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />
    </header>
  );
};
