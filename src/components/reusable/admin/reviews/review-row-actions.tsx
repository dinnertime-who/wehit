"use client";

import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAdminDeleteReview } from "@/hooks/apis/admin/use-admin-delete-review";
import { useDialogService } from "@/hooks/stores/use-dialog-service";
import { toast } from "sonner";
import type { Review } from "@/shared/types/review.type";
import { ReviewEditDialog } from "./review-edit-dialog";

type Props = {
  review: Review;
};

export const ReviewRowActions = ({ review }: Props) => {
  const deleteMutation = useAdminDeleteReview(review.id);
  const dialogService = useDialogService();

  const handleDelete = async () => {
    const confirmed = await dialogService.confirm(
      "정말 이 리뷰를 삭제하시겠습니까?"
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync();
      toast.success("리뷰가 삭제되었습니다");
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("리뷰 삭제에 실패했습니다");
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
          <ReviewEditDialog review={review}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Edit className="w-4 h-4" />
              수정
            </Button>
          </ReviewEditDialog>
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

