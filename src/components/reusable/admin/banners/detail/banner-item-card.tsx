"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { publicEnv } from "@/config/env/public";
import { useDeleteBannerItem } from "@/hooks/apis/banners/use-delete-banner-item";
import { useDialogService } from "@/hooks/stores/use-dialog-service";
import type { Banner, BannerItem } from "@/shared/types/banner.type";
import type { LinkHref } from "@/shared/types/util.type";
import { BannerItemForm } from "./banner-item-form";

type Props = {
  bannerId: string;
  banner: Banner;
  item: BannerItem;
};

export const BannerItemCard = ({ bannerId, banner, item }: Props) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const dialogService = useDialogService();
  const deleteMutation = useDeleteBannerItem(item.id, bannerId);

  const handleDelete = async () => {
    const confirmed = await dialogService.confirm(
      "정말 이 배너 아이템을 삭제하시겠습니까?",
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync();
      toast.success("배너 아이템이 삭제되었습니다");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다",
      );
    }
  };

  const aspectRatioStyle = `${banner.widthRatio}/${banner.heightRatio}`;

  const linkUrl = item.linkUrl.startsWith("http")
    ? item.linkUrl
    : `${publicEnv.NEXT_PUBLIC_URL}${item.linkUrl}`;

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* 이미지 썸네일 */}
            <div
              className="relative overflow-hidden max-h-[250px]"
              style={{ aspectRatio: aspectRatioStyle }}
            >
              <Image
                src={item.imageUrl}
                alt="배너 아이템"
                fill
                className="object-contain"
              />
            </div>

            <div>
              {/* 정보 */}
              <div className="flex-1 space-y-2 mb-4">
                <div className="flex flex-col items-start gap-y-2 justify-between">
                  <div className="text-sm font-medium">
                    순서: {item.order + 1}
                  </div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <Link
                    href={linkUrl as LinkHref}
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline truncate"
                  >
                    {linkUrl}
                  </Link>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    생성:{" "}
                    {format(new Date(item.createdAt), "yyyy-MM-dd HH:mm", {
                      locale: ko,
                    })}
                  </div>
                </div>

                <div className="text-sm flex items-center gap-x-2 text-muted-foreground">
                  <div>배경색:</div>
                  <div className="py-1 px-2 border rounded-lg">
                    <input
                      type="color"
                      disabled
                      value={item.backgroundColor ?? "#ffffff"}
                    />
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  disabled={deleteMutation.isPending}
                >
                  <Edit className="w-4 h-4" />
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수정 폼 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>배너 아이템 수정</DialogTitle>
            <DialogDescription>
              배너 아이템의 정보를 수정합니다
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[clamp(200px,80dvh,500px)]">
            <BannerItemForm
              bannerId={bannerId}
              banner={banner}
              mode="edit"
              item={item}
              onClose={() => setIsEditDialogOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
