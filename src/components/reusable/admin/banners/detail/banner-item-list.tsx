"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BannerWithItems } from "@/shared/types/banner.type";
import { BannerItemCard } from "./banner-item-card";
import { BannerItemForm } from "./banner-item-form";

type Props = {
  bannerId: string;
  banner: BannerWithItems;
};

export const BannerItemList = ({ bannerId, banner }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const items = banner.items || [];
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>배너 아이템</CardTitle>
              <CardDescription>
                배너에 표시될 이미지와 링크를 관리합니다
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setIsFormOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              아이템 추가
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {sortedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">배너 아이템이 없습니다</p>
              <p className="text-sm text-muted-foreground mt-1">
                아이템 추가 버튼을 클릭하여 새 아이템을 추가해주세요
              </p>
            </div>
          ) : (
            <div className="gap-4 grid grid-cols-2">
              {sortedItems.map((item) => (
                <BannerItemCard
                  key={item.id}
                  bannerId={bannerId}
                  banner={banner}
                  item={item}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 추가 폼 다이얼로그 */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>배너 아이템 추가</DialogTitle>
            <DialogDescription>
              배너에 표시될 새로운 아이템을 추가합니다
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[clamp(200px,80dvh,500px)]">
            <BannerItemForm
              bannerId={bannerId}
              banner={banner}
              mode="create"
              onClose={() => setIsFormOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
