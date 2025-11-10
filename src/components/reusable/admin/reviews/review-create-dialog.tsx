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
import { useAdminCreateReview } from "@/hooks/apis/admin/use-admin-create-review";
import { useServices } from "@/hooks/apis/services/use-services";

const reviewFormSchema = z.object({
  serviceId: z.string().min(1, "서비스를 선택해주세요"),
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
  children: React.ReactNode;
};

export const ReviewCreateDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const createMutation = useAdminCreateReview();
  const { data: services } = useServices();

  const form = useAppForm({
    defaultValues: {
      serviceId: "",
      writerName: "",
      rating: 5,
      content: "",
    } as ReviewFormValues,
    validators: {
      onSubmit: reviewFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          serviceId: value.serviceId,
          writerName: value.writerName,
          rating: value.rating,
          content: value.content,
        });
        toast.success("리뷰가 생성되었습니다");
        setOpen(false);
        form.reset();
      } catch (error) {
        console.error("Failed to create review:", error);
        toast.error("리뷰 생성에 실패했습니다");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰 생성</DialogTitle>
          <DialogDescription>
            새로운 리뷰를 생성할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="serviceId"
            validators={{
              onChange: reviewFormSchema.shape.serviceId,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="serviceId">서비스</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="서비스를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.data.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title}
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
              disabled={createMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !form.state.isFormValid}
            >
              {createMutation.isPending ? "생성 중..." : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
