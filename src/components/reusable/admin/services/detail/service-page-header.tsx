"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServiceId } from "./service-id-provider";

export const ServicePageHeader = () => {
  const router = useRouter();
  const serviceId = useServiceId();

  return (
    <div className="mb-8 flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="-ml-2"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        뒤로가기
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">서비스 수정</h1>
        <p className="text-sm text-muted-foreground mt-2">
          서비스 정보를 수정합니다
        </p>
      </div>
    </div>
  );
};
