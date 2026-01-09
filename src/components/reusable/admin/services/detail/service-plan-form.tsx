"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { Button } from "@/components/ui/button";
import {
  useCreateServicePlan,
  useUpdateServicePlan,
} from "@/hooks/apis/use-service-plans";
import type {
  PlanType,
  ServicePlanFormatted,
} from "@/shared/types/service.type";
import { Trash2 } from "lucide-react";

const servicePlanFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().int().positive("정가는 양수여야 합니다"),
  salePrice: z.number().int().positive().optional().or(z.literal(0)),
  hasVAT: z.boolean(),
  // Details
  canRetouch: z.boolean(),
  canPostprocess: z.boolean(),
  shootingTime: z.number().int().positive("촬영 시간은 양수여야 합니다"),
  imageCount: z.number().int().positive("이미지 개수는 양수여야 합니다"),
  workingDays: z.number().int().positive("작업 일수는 양수여야 합니다"),
  revisionCount: z.number().int().positive("수정 횟수는 양수여야 합니다"),
});

type ServicePlanFormValues = z.infer<typeof servicePlanFormSchema>;

type Props = {
  serviceId: string;
  planType: PlanType;
  existingPlan?: ServicePlanFormatted;
};

export const ServicePlanForm = ({
  serviceId,
  planType,
  existingPlan,
}: Props) => {
  const createMutation = useCreateServicePlan();
  const updateMutation = useUpdateServicePlan();
  const [featureInput, setFeatureInput] = useState("");

  const isEditing = !!existingPlan;

  const form = useAppForm({
    defaultValues: {
      title: existingPlan?.title || "",
      description: existingPlan?.description || "",
      price: existingPlan?.price || 0,
      salePrice: existingPlan?.salePrice || undefined,
      hasVAT: existingPlan?.hasVAT ?? true,
      canRetouch: existingPlan?.features.canRetouch ?? false,
      canPostprocess: existingPlan?.features.canPostprocess ?? false,
      shootingTime: existingPlan?.shootingTime || 0,
      imageCount: existingPlan?.imageCount || 0,
      workingDays: existingPlan?.workingDays || 0,
      revisionCount: existingPlan?.revisionCount || 0,
    } as ServicePlanFormValues,
    validators: {
      onSubmit: servicePlanFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          serviceId,
          planType,
          title: value.title || undefined,
          description: value.description || undefined,
          price: value.price,
          salePrice: value.salePrice || undefined,
          hasVAT: value.hasVAT,
          details: {
            features: {
              canRetouch: value.canRetouch,
              canPostprocess: value.canPostprocess,
            },
            shootingTime: value.shootingTime,
            imageCount: value.imageCount,
            workingDays: value.workingDays,
            revisionCount: value.revisionCount,
          },
        };

        if (isEditing) {
          await updateMutation.mutateAsync({
            serviceId,
            planType,
            data: payload,
          });
          toast.success(`${planType} 플랜이 수정되었습니다`);
        } else {
          await createMutation.mutateAsync(payload);
          toast.success(`${planType} 플랜이 생성되었습니다`);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다";
        console.error(error);
        toast.error(message);
      }
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
      <form.AppForm>
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">기본 정보</h4>
            <div className="grid grid-cols-1 gap-4">
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    label="플랜 제목 (선택)"
                    placeholder="예: 기본 촬영 패키지"
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.TextareaField
                    label="플랜 설명 (선택)"
                    placeholder="플랜에 대한 간단한 설명"
                    disabled={isLoading}
                  />
                )}
              </form.AppField>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">가격 정보</h4>
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="price">
                {(field) => (
                  <field.NumberField
                    label="정가"
                    min={100}
                    required
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="salePrice">
                {(field) => (
                  <field.NumberField
                    label="할인가 (선택)"
                    min={0}
                    disabled={isLoading}
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="hasVAT">
              {(field) => (
                <field.CheckboxField
                  label="VAT 포함"
                  disabled={isLoading}
                />
              )}
            </form.AppField>
          </div>

          {/* 플랜 상세 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">플랜 상세</h4>
            
            <div className="space-y-2">
              <form.AppField name="canRetouch">
                {(field) => (
                  <field.CheckboxField
                    label="보정 가능"
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="canPostprocess">
                {(field) => (
                  <field.CheckboxField
                    label="후처리 가능"
                    disabled={isLoading}
                  />
                )}
              </form.AppField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="shootingTime">
                {(field) => (
                  <field.NumberField
                    label="촬영 시간 (시간)"
                    min={1}
                    required
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="imageCount">
                {(field) => (
                  <field.NumberField
                    label="이미지 개수"
                    min={1}
                    required
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="workingDays">
                {(field) => (
                  <field.NumberField
                    label="작업 일수"
                    min={1}
                    required
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="revisionCount">
                {(field) => (
                  <field.NumberField
                    label="수정 횟수"
                    min={0}
                    required
                    disabled={isLoading}
                  />
                )}
              </form.AppField>
            </div>
          </div>

          <div className="flex justify-end">
            <form.SubmitButton>
              {isLoading
                ? "저장 중..."
                : isEditing
                  ? "플랜 수정"
                  : "플랜 생성"}
            </form.SubmitButton>
          </div>
        </div>
      </form.AppForm>
    </form>
  );
};
