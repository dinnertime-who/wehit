"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useBanner } from "@/hooks/apis/banners/use-banner";
import { cn } from "@/lib/utils";
import { useBannerId } from "./banner-id-provider";

export const BannersPageHeader = () => {
  const id = useBannerId();
  const { data: banner } = useBanner(id);

  return (
    <div className="flex items-center justify-between">
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">{banner?.slug}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          배너 목록을 보고 관리할 수 있습니다
        </p>
      </div>

      <Link
        href={"/admin/banners"}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        <ChevronLeft />
        돌아가기
      </Link>
    </div>
  );
};
