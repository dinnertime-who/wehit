"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRemoveDisplayService } from "@/hooks/apis/displays/use-remove-display-service";
import { cn } from "@/lib/utils";
import type { DisplayServiceRecord } from "@/shared/types/display.type";

type Props = {
  displayService: DisplayServiceRecord;
  displayId: string;
  isReordering?: boolean;
};

export const DisplayServiceCard = ({
  displayService,
  displayId,
  isReordering = false,
}: Props) => {
  const removeMutation = useRemoveDisplayService(displayId);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: displayService.id,
    disabled: isReordering,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = async () => {
    try {
      await removeMutation.mutateAsync({
        serviceId: displayService.serviceId,
      });
      toast.success("서비스가 제거되었습니다");
    } catch (error) {
      console.error("Failed to remove service:", error);
      toast.error("서비스 제거에 실패했습니다");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative p-4 border rounded-lg bg-card hover:bg-muted/50 transition-all",
        isDragging &&
          "opacity-60 shadow-lg border-primary ring-2 ring-primary/20 scale-105 z-50",
        isReordering && "opacity-75 pointer-events-none",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            disabled={isReordering}
            className={cn(
              "cursor-grab active:cursor-grabbing touch-none p-1 text-muted-foreground hover:text-foreground transition-colors",
              isReordering && "cursor-not-allowed opacity-50",
            )}
            type="button"
            aria-label="드래그하여 순서 변경"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              순서: {displayService.order + 1}
            </div>
            <div className="text-sm text-muted-foreground">
              서비스 이름: {displayService.service.title}
            </div>
            <Link
              href={`/admin/services/${displayService.serviceId}`}
              className="text-xs text-blue-600 hover:underline truncate"
              target="_blank"
            >
              서비스 수정하기
            </Link>
            <div className="relative aspect-640/360 w-full mt-4">
              <Image
                src={displayService.service.coverImageUrl}
                alt={displayService.service.title}
                fill
              />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={removeMutation.isPending}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {isReordering && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Spinner className="w-6 h-6" />
            <span className="text-sm text-muted-foreground">
              순서 변경 중...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
