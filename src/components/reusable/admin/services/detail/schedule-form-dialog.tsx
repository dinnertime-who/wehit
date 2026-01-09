"use client";

import { useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  useCreateServiceSchedule,
  useUpdateServiceSchedule,
} from "@/hooks/apis/use-service-schedules";
import type { ServiceSchedule } from "@/shared/types/service.type";

const scheduleFormSchema = z.object({
  scheduleType: z.enum(["flexible", "fixed"]),
  scheduleDescription: z.string().optional(),
  location: z.string().min(1, "위치는 필수입니다"),
  locationDetail: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

type Props = {
  serviceId: string;
  schedule?: ServiceSchedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SCHEDULE_TYPE_OPTIONS = [
  { label: "유연한 일정", value: "flexible" },
  { label: "고정된 일정", value: "fixed" },
];

export const ScheduleFormDialog = ({
  serviceId,
  schedule,
  open,
  onOpenChange,
}: Props) => {
  const createMutation = useCreateServiceSchedule();
  const updateMutation = useUpdateServiceSchedule();

  const isEditing = !!schedule;

  const form = useAppForm({
    defaultValues: {
      scheduleType: (schedule?.scheduleType as "flexible" | "fixed") || "flexible",
      scheduleDescription: schedule?.scheduleDescription || "",
      location: schedule?.location || "",
      locationDetail: schedule?.locationDetail || "",
    } as ScheduleFormValues,
    validators: {
      onSubmit: scheduleFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateMutation.mutateAsync({
            serviceId,
            scheduleId: schedule.id,
            data: {
              scheduleType: value.scheduleType,
              scheduleDescription: value.scheduleDescription || undefined,
              location: value.location,
              locationDetail: value.locationDetail || undefined,
            },
          });
          toast.success("스케줄이 수정되었습니다");
        } else {
          await createMutation.mutateAsync({
            serviceId,
            scheduleType: value.scheduleType,
            scheduleDescription: value.scheduleDescription || undefined,
            location: value.location,
            locationDetail: value.locationDetail || undefined,
          });
          toast.success("스케줄이 생성되었습니다");
        }
        onOpenChange(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다";
        console.error(error);
        toast.error(message);
      }
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
        >
          <form.AppForm>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "스케줄 수정" : "스케줄 추가"}
              </DialogTitle>
              <DialogDescription>
                클래스 스케줄 정보를 입력해주세요
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <form.AppField name="scheduleType">
                {(field) => (
                  <field.SelectField
                    label="일정 타입"
                    options={SCHEDULE_TYPE_OPTIONS}
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="scheduleDescription">
                {(field) => (
                  <field.TextareaField
                    label="일정 설명 (선택)"
                    placeholder="예: 평일 오전 10시-12시, 메세지로 조율 가능"
                    disabled={isLoading}
                    rows={3}
                  />
                )}
              </form.AppField>

              <form.AppField name="location">
                {(field) => (
                  <field.TextField
                    label="위치"
                    placeholder="예: 강남역"
                    required
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="locationDetail">
                {(field) => (
                  <field.TextField
                    label="상세 위치 (선택)"
                    placeholder="예: 2호선 10번 출구 근처"
                    disabled={isLoading}
                  />
                )}
              </form.AppField>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                취소
              </Button>
              <form.SubmitButton>
                {isLoading
                  ? "저장 중..."
                  : isEditing
                    ? "수정"
                    : "생성"}
              </form.SubmitButton>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};
