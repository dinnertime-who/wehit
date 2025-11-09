"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { useServices } from "@/hooks/apis/services/use-services";
import { useAddDisplayService } from "@/hooks/apis/displays/use-add-display-service";
import { toast } from "sonner";

const serviceSearchSchema = z.object({
  serviceId: z.string().min(1, "서비스를 선택해주세요"),
  order: z.number().int().nonnegative("순서는 0 이상이어야 합니다"),
});

type ServiceSearchFormValues = z.infer<typeof serviceSearchSchema>;

type Props = {
  displayId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ServiceSearchDialog = ({
  displayId,
  open,
  onOpenChange,
}: Props) => {
  const { data: services = [] } = useServices();
  const addMutation = useAddDisplayService(displayId);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useAppForm({
    defaultValues: {
      serviceId: "",
      order: 0,
    } as ServiceSearchFormValues,
    validators: {
      onSubmit: serviceSearchSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await addMutation.mutateAsync({
          serviceId: value.serviceId,
          order: value.order,
        });
        toast.success("서비스가 추가되었습니다");
        onOpenChange(false);
        setSearchTerm("");
        form.reset();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다";
        console.error(error);
        toast.error(message);
      }
    },
  });

  const isLoading = addMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>서비스 추가</DialogTitle>
          <DialogDescription>
            디스플레이에 표시할 서비스를 검색하고 추가합니다
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.AppForm>
            {/* 서비스 검색 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                서비스 검색<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="서비스명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
              />
            </div>

            {/* 서비스 선택 */}
            <form.AppField name="serviceId">
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="service-select" className="text-sm font-medium">
                    선택된 서비스<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="service-select"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                  >
                    <option value="">-- 서비스 선택 --</option>
                    {filteredServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.AppField>

            {/* 순서 입력 */}
            <form.AppField name="order">
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="order-input" className="text-sm font-medium">
                    표시 순서
                  </label>
                  <input
                    id="order-input"
                    type="number"
                    min="0"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value, 10))
                    }
                    onBlur={field.handleBlur}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.AppField>
          </form.AppForm>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "추가 중..." : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
