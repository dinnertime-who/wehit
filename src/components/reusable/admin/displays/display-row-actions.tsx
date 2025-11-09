"use client";

import Link from "next/link";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useDeleteDisplay } from "@/hooks/apis/displays/use-delete-display";
import { useDialogService } from "@/hooks/stores/use-dialog-service";
import { toast } from "sonner";
import type { Display } from "@/shared/types/display.type";

type Props = {
  display: Display;
};

export const DisplayRowActions = ({ display }: Props) => {
  const deleteMutation = useDeleteDisplay(display.id);
  const dialogService = useDialogService();

  const handleDelete = async () => {
    const confirmed = await dialogService.confirm(
      "정말 이 디스플레이를 삭제하시겠습니까?"
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync();
      toast.success("디스플레이가 삭제되었습니다");
    } catch (error) {
      console.error("Failed to delete display:", error);
      toast.error("디스플레이 삭제에 실패했습니다");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40">
        <div className="flex flex-col gap-2">
          <Link href={`/admin/displays/${display.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Edit className="w-4 h-4" />
              수정
            </Button>
          </Link>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
