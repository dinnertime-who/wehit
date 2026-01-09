"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateServicePlan,
  useUpdateServicePlan,
} from "@/hooks/apis/use-service-plans";
import type {
  PlanType,
  ServicePlanFormatted,
  PlanDetails,
} from "@/shared/types/service.type";
import { Plus, Trash2 } from "lucide-react";

const servicePlanFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().int().positive("정가는 양수여야 합니다"),
  salePrice: z.number().int().positive().optional().or(z.literal(0)),
  hasVAT: z.boolean(),
});

type ServicePlanFormValues = z.infer<typeof servicePlanFormSchema>;

type DetailItem = {
  key: string;
  value: string | number | boolean;
  type: "string" | "number" | "boolean";
};

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

  const isEditing = !!existingPlan;

  // Initialize details from existing plan
  const [detailItems, setDetailItems] = useState<DetailItem[]>(() => {
    if (!existingPlan?.details) return [];
    return Object.entries(existingPlan.details).map(([key, value]) => ({
      key,
      value,
      type: typeof value as "string" | "number" | "boolean",
    }));
  });

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState<"string" | "number" | "boolean">(
    "string",
  );

  const form = useAppForm({
    defaultValues: {
      title: existingPlan?.title || "",
      description: existingPlan?.description || "",
      price: existingPlan?.price || 0,
      salePrice: existingPlan?.salePrice || undefined,
      hasVAT: existingPlan?.hasVAT ?? true,
    } as ServicePlanFormValues,
    validators: {
      onSubmit: servicePlanFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // Convert detailItems to PlanDetails
        const details: PlanDetails = {};
        detailItems.forEach((item) => {
          details[item.key] = item.value;
        });

        const payload = {
          serviceId,
          planType,
          title: value.title || undefined,
          description: value.description || undefined,
          price: value.price,
          salePrice: value.salePrice || undefined,
          hasVAT: value.hasVAT,
          details,
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

  const handleAddDetail = () => {
    if (!newKey.trim()) {
      toast.error("키를 입력해주세요");
      return;
    }

    if (detailItems.some((item) => item.key === newKey)) {
      toast.error("이미 존재하는 키입니다");
      return;
    }

    let parsedValue: string | number | boolean = newValue;
    if (newType === "number") {
      parsedValue = parseFloat(newValue) || 0;
    } else if (newType === "boolean") {
      parsedValue = newValue === "true";
    }

    setDetailItems([...detailItems, { key: newKey, value: parsedValue, type: newType }]);
    setNewKey("");
    setNewValue("");
    setNewType("string");
  };

  const handleRemoveDetail = (index: number) => {
    setDetailItems(detailItems.filter((_, i) => i !== index));
  };

  const handleUpdateDetail = (
    index: number,
    field: "key" | "value",
    newVal: string,
  ) => {
    const updated = [...detailItems];
    if (field === "key") {
      updated[index].key = newVal;
    } else {
      const type = updated[index].type;
      if (type === "number") {
        updated[index].value = parseFloat(newVal) || 0;
      } else if (type === "boolean") {
        updated[index].value = newVal === "true";
      } else {
        updated[index].value = newVal;
      }
    }
    setDetailItems(updated);
  };

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
                <field.CheckboxField label="VAT 포함" disabled={isLoading} />
              )}
            </form.AppField>
          </div>

          {/* 플랜 상세 (Key-Value) */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">플랜 상세 정보</h4>

            {/* 기존 항목 */}
            <div className="space-y-2">
              {detailItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs">키</Label>
                    <Input
                      value={item.key}
                      onChange={(e) =>
                        handleUpdateDetail(index, "key", e.target.value)
                      }
                      disabled={isLoading}
                      placeholder="예: shootingTime"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">값 ({item.type})</Label>
                    {item.type === "boolean" ? (
                      <Select
                        value={item.value.toString()}
                        onValueChange={(val) =>
                          handleUpdateDetail(index, "value", val)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">true</SelectItem>
                          <SelectItem value="false">false</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={item.type === "number" ? "number" : "text"}
                        value={item.value.toString()}
                        onChange={(e) =>
                          handleUpdateDetail(index, "value", e.target.value)
                        }
                        disabled={isLoading}
                        placeholder={
                          item.type === "number" ? "예: 120" : "예: 촬영 2시간"
                        }
                      />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDetail(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* 새 항목 추가 */}
            <div className="border-t pt-4 space-y-3">
              <Label className="text-sm font-medium">새 항목 추가</Label>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">키</Label>
                  <Input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="예: shootingTime"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">타입</Label>
                  <Select
                    value={newType}
                    onValueChange={(val: "string" | "number" | "boolean") =>
                      setNewType(val)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">문자열</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                      <SelectItem value="boolean">참/거짓</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs">값</Label>
                  {newType === "boolean" ? (
                    <Select
                      value={newValue}
                      onValueChange={setNewValue}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">true</SelectItem>
                        <SelectItem value="false">false</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={newType === "number" ? "number" : "text"}
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder={
                        newType === "number" ? "예: 120" : "예: 촬영 2시간"
                      }
                      disabled={isLoading}
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddDetail}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
