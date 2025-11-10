"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdminUpdateReview } from "@/hooks/apis/admin/use-admin-update-review";
import type { Review } from "@/shared/types/review.type";

const reviewFormSchema = z.object({
  writerName: z.string().min(1, "작성자 이름을 입력해주세요"),
  rating: z
    .number()
    .int()
    .min(1, "평점은 1 이상이어야 합니다")
    .max(5, "평점은 5 이하여야 합니다"),
  content: z.string().min(1, "리뷰 내용을 입력해주세요"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

type Props = {
  review: Review;
  children: React.ReactNode;
};

export const ReviewEditDialog = ({ review, children }: Props) => {
  const [open, setOpen] = useState(false);
  const updateMutation = useAdminUpdateReview(review.id);

  const form = useAppForm({
    defaultValues: {
      writerName: review.writerName,
      rating: review.rating,
      content: review.content,
    } as ReviewFormValues,
    validators: {
      onSubmit: reviewFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({
          writerName: value.writerName,
          rating: value.rating,
          content: value.content,
        });
        toast.success("리뷰가 수정되었습니다");
        setOpen(false);
      } catch (error) {
        console.error("Failed to update review:", error);
        toast.error("리뷰 수정에 실패했습니다");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰 수정</DialogTitle>
          <DialogDescription>리뷰 정보를 수정할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="writerName"
            validators={{
              onChange: reviewFormSchema.shape.writerName,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="writerName">작성자 이름</Label>
                <Input
                  id="writerName"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={updateMutation.isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="rating"
            validators={{
              onChange: reviewFormSchema.shape.rating,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="rating">평점</Label>
                <Select
                  value={field.state.value.toString()}
                  onValueChange={(value) => field.handleChange(Number(value))}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="평점을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating}점
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="content"
            validators={{
              onChange: reviewFormSchema.shape.content,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="content">리뷰 내용</Label>
                <Textarea
                  id="content"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={updateMutation.isPending}
                  rows={5}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending || !form.state.isFormValid}
            >
              {updateMutation.isPending ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
