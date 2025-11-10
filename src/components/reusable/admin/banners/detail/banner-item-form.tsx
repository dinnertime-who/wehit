"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { Button } from "@/components/ui/button";
import { useCreateBannerItem } from "@/hooks/apis/banners/use-create-banner-item";
import { useUpdateBannerItem } from "@/hooks/apis/banners/use-update-banner-item";
import { useUploadImage } from "@/hooks/apis/upload/use-upload-image";
import { useUploadVideo } from "@/hooks/apis/upload/use-upload-video";
import type { Banner, BannerItem } from "@/shared/types/banner.type";
import { ServiceLinkDialog } from "./service-link-dialog";

const bannerItemFormSchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "파일 크기는 5MB 이하여야 합니다",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "JPEG, PNG, WEBP 형식만 지원됩니다",
    )
    .nullable()
    .optional(),
  video: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 50 * 1024 * 1024,
      "파일 크기는 50MB 이하여야 합니다",
    )
    .refine(
      (file) => ["video/mp4", "video/webm", "video/quicktime"].includes(file.type),
      "MP4, WEBM, MOV 형식만 지원됩니다",
    )
    .nullable()
    .optional(),
  linkUrl: z.string("유효한 URL을 입력해주세요"),
  order: z
    .number()
    .int("정수를 입력해주세요")
    .nonnegative("0 이상의 정수를 입력해주세요"),
  viewStartDate: z.date().nullable().optional(),
  viewEndDate: z.date().nullable().optional(),
});

type BannerItemFormValues = z.infer<typeof bannerItemFormSchema>;

type Props = {
  bannerId: string;
  banner: Banner;
  mode: "create" | "edit";
  item?: BannerItem;
  onClose?: () => void;
};

export const BannerItemForm = ({
  bannerId,
  banner,
  mode,
  item,
  onClose,
}: Props) => {
  const router = useRouter();
  const uploadImageMutation = useUploadImage();
  const uploadVideoMutation = useUploadVideo();
  const createMutation = useCreateBannerItem(bannerId);
  const updateMutation = useUpdateBannerItem(item?.id || "", bannerId);
  const [isServiceLinkDialogOpen, setIsServiceLinkDialogOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      image: null as File | null,
      video: null as File | null,
      linkUrl: item?.linkUrl || "",
      order: item?.order ?? 0,
      viewStartDate: item?.viewStartDate || null,
      viewEndDate: item?.viewEndDate || null,
    } as BannerItemFormValues,
    validators: {
      onSubmit: bannerItemFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        let imageUrl = item?.imageUrl;
        let videoUrl = item?.videoUrl || null;

        // 새 이미지가 선택된 경우 업로드
        if (value.image) {
          const uploadResult = await uploadImageMutation.mutateAsync(value.image);
          imageUrl = uploadResult.imageUrl;
        }

        // 새 영상이 선택된 경우 업로드
        if (value.video) {
          const uploadResult = await uploadVideoMutation.mutateAsync(value.video);
          videoUrl = uploadResult.videoUrl;
        }

        // 이미지가 없으면 에러
        if (!imageUrl) {
          toast.error("이미지를 선택해주세요");
          return;
        }

        if (mode === "create") {
          await createMutation.mutateAsync({
            bannerId,
            imageUrl,
            videoUrl: videoUrl || undefined,
            linkUrl: value.linkUrl,
            order: value.order,
            viewStartDate: value.viewStartDate,
            viewEndDate: value.viewEndDate,
          });
          toast.success("배너 아이템이 생성되었습니다");
        } else {
          await updateMutation.mutateAsync({
            imageUrl,
            videoUrl: videoUrl || undefined,
            linkUrl: value.linkUrl,
            order: value.order,
            viewStartDate: value.viewStartDate,
            viewEndDate: value.viewEndDate,
          });
          toast.success("배너 아이템이 업데이트되었습니다");
        }

        router.refresh();
        onClose?.();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "작업 중 오류가 발생했습니다",
        );
      }
    },
  });

  const handleServiceSelect = (serviceId: string) => {
    form.setFieldValue("linkUrl", `/service/${serviceId}`);
    setIsServiceLinkDialogOpen(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppForm>
        <form.Fieldset className="space-y-6">
          {/* 이미지 필드 */}
          <form.AppField name="image">
            {(field) => (
              <field.ImageField
                label={mode === "edit" ? "새 이미지 (선택)" : "배너 이미지"}
                required={mode === "create"}
                aspectRatio={`${banner.widthRatio}/${banner.heightRatio}`}
              />
            )}
          </form.AppField>

          {/* 영상 필드 */}
          <form.AppField name="video">
            {(field) => (
              <field.VideoField
                label={mode === "edit" ? "새 영상 (선택)" : "배너 영상 (선택)"}
                defaultPreview={item?.videoUrl || undefined}
              />
            )}
          </form.AppField>

          {/* 링크 URL */}
          <form.AppField name="linkUrl">
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    클릭 링크 URL<span className="text-red-500 ml-1">*</span>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsServiceLinkDialogOpen(true)}
                  >
                    서비스 검색
                  </Button>
                </div>
                <field.TextField
                  placeholder="https://example.com 또는 /service/123"
                  required
                />
              </div>
            )}
          </form.AppField>

          {/* 순서 */}
          <form.AppField name="order">
            {(field) => (
              <field.NumberField
                label="표시 순서"
                placeholder="0"
                step="1"
                min="0"
                required
              />
            )}
          </form.AppField>

          {/* 날짜 필드 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="viewStartDate">
              {(field) => <field.DateField label="노출 시작일 (선택)" />}
            </form.AppField>

            <form.AppField name="viewEndDate">
              {(field) => <field.DateField label="노출 종료일 (선택)" />}
            </form.AppField>
          </div>
        </form.Fieldset>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-3 justify-end pt-6">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full cursor-pointer px-4 py-2 text-sm rounded-md border hover:bg-muted"
            >
              취소
            </Button>
          )}
          <form.SubmitButton>
            {mode === "create" ? "생성" : "수정"}
          </form.SubmitButton>
        </div>
      </form.AppForm>
    </form>

    <ServiceLinkDialog
      open={isServiceLinkDialogOpen}
      onOpenChange={setIsServiceLinkDialogOpen}
      onSelect={handleServiceSelect}
    />
  );
};
