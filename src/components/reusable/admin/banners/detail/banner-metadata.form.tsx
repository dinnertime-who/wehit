"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateBannerSchema } from "@/features/banner/schemas/banner.schema";
import { useUpdateBanner } from "@/hooks/apis/banners/use-update-banner";
import { useBannerWithProvider } from "@/hooks/reusable/admin/banner/use-banner-with-provider";
import { useBannerId } from "./banner-id-provider";

const displayDeviceOptions = [
  { value: "all", label: "전체" },
  { value: "mobile", label: "모바일" },
  { value: "desktop", label: "데스크톱" },
];

export const BannerUpdateForm = () => {
  const router = useRouter();
  const bannerId = useBannerId();
  const { data: banner } = useBannerWithProvider();
  const updateMutation = useUpdateBanner(bannerId);

  const form = useAppForm({
    defaultValues: {
      slug: banner.slug,
      displayDevice: banner.displayDevice,
      heightRatio: banner.heightRatio,
      widthRatio: banner.widthRatio,
    } as z.infer<typeof updateBannerSchema>,
    validators: {
      onSubmit: updateBannerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync(value);
        toast.success("배너가 정상적으로 업데이트 되었습니다");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "배너 업데이트 중 오류가 발생했습니다",
        );
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mt-8"
    >
      <form.AppForm>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>배너 설정</CardTitle>
            <CardDescription>
              배너의 기본 정보와 비율을 설정합니다
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form.Fieldset className="space-y-6">
              {/* 기본 정보 섹션 */}
              <div className="space-y-4">
                <div className="text-sm font-medium">기본 정보</div>
                <form.AppField name="slug">
                  {(field) => (
                    <field.TextField
                      label="배너 식별자"
                      placeholder="예: main-hero-banner"
                      disabled
                    />
                  )}
                </form.AppField>

                <form.AppField name="displayDevice">
                  {(field) => (
                    <field.SelectField
                      label="노출 기기"
                      placeholder="기기를 선택해주세요"
                      options={displayDeviceOptions}
                      disabled
                    />
                  )}
                </form.AppField>
              </div>

              {/* 이미지 비율 섹션 */}
              <div className="space-y-4">
                <div className="text-sm font-medium">이미지 비율</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <form.AppField name="widthRatio">
                    {(field) => (
                      <field.NumberField
                        label="가로 비율"
                        placeholder="예: 1920"
                        step="1"
                        min="1"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="heightRatio">
                    {(field) => (
                      <field.NumberField
                        label="세로 비율"
                        placeholder="예: 400"
                        step="1"
                        min="1"
                      />
                    )}
                  </form.AppField>
                </div>
                <p className="text-xs text-muted-foreground">
                  현재 비율: {banner.widthRatio} × {banner.heightRatio}
                </p>
              </div>
            </form.Fieldset>
          </CardContent>

          <CardFooter className="border-t bg-muted/30 justify-end gap-3">
            <form.SubmitButton>
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </form.SubmitButton>
          </CardFooter>
        </Card>
      </form.AppForm>
    </form>
  );
};
