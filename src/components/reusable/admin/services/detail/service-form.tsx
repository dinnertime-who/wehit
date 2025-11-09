"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { useCreateService } from "@/hooks/apis/services/use-create-service";
import { useUpdateService } from "@/hooks/apis/services/use-update-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  Service,
  CreateServiceDTO,
  UpdateServiceDTO,
} from "@/shared/types/service.type";

const CATEGORY_OPTIONS = [
  { label: "프로그래밍", value: "programming" },
  { label: "디자인", value: "design" },
  { label: "마케팅", value: "marketing" },
  { label: "비즈니스", value: "business" },
  { label: "기타", value: "etc" },
];

const serviceFormSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  subtitle: z.string().optional(),
  category: z.string().min(1, "카테고리는 필수입니다"),
  tutorInfo: z.string().min(1, "튜터 정보는 필수입니다"),
  coverImage: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "파일 크기는 10MB 이하여야 합니다",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "JPEG, PNG, WEBP 형식만 지원됩니다",
    )
    .nullable()
    .optional(),
  coverVideo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 100 * 1024 * 1024,
      "파일 크기는 100MB 이하여야 합니다",
    )
    .refine(
      (file) => ["video/mp4", "video/webm"].includes(file.type),
      "MP4, WebM 형식만 지원됩니다",
    )
    .nullable()
    .optional(),
  description: z.string().min(1, "설명은 필수입니다"),
  price: z.number().int().positive("정가는 양수여야 합니다"),
  salePrice: z.number().int().positive().optional().or(z.literal(0)),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

type Props = {
  mode: "create" | "edit";
  service?: Service;
};

export const ServiceForm = ({ mode, service }: Props) => {
  const router = useRouter();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService(service?.id || "");

  const defaultValues: ServiceFormValues = {
    title: service?.title || "",
    subtitle: service?.subtitle || "",
    category: service?.category || "",
    tutorInfo: service?.tutorInfo || "",
    coverImage: null,
    coverVideo: null,
    description: service?.description || "",
    price: service?.price || 0,
    salePrice: service?.salePrice || undefined,
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: serviceFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // Upload image if provided
        let coverImageUrl = service?.coverImageUrl || "";
        if (value.coverImage) {
          const imageFormData = new FormData();
          imageFormData.append("file", value.coverImage);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: imageFormData,
          });
          const uploadData = (await uploadRes.json()) as { url?: string };
          if (!uploadData.url) throw new Error("이미지 업로드 실패");
          coverImageUrl = uploadData.url;
        }

        // Upload video if provided
        let coverVideoUrl = service?.coverVideoUrl || "";
        if (value.coverVideo) {
          const videoFormData = new FormData();
          videoFormData.append("file", value.coverVideo);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: videoFormData,
          });
          const uploadData = (await uploadRes.json()) as { url?: string };
          if (!uploadData.url) throw new Error("비디오 업로드 실패");
          coverVideoUrl = uploadData.url;
        }

        if (mode === "create") {
          const payload: CreateServiceDTO = {
            title: value.title,
            subtitle: value.subtitle,
            category: value.category,
            tutorInfo: value.tutorInfo,
            coverImageUrl,
            coverVideoUrl: coverVideoUrl || undefined,
            description: value.description,
            price: value.price,
            salePrice: value.salePrice,
          };
          await createMutation.mutateAsync(payload);
          toast.success("서비스가 생성되었습니다");
        } else {
          const payload: UpdateServiceDTO = {
            title: value.title,
            subtitle: value.subtitle,
            category: value.category,
            tutorInfo: value.tutorInfo,
            coverImageUrl,
            coverVideoUrl: coverVideoUrl || undefined,
            description: value.description,
            price: value.price,
            salePrice: value.salePrice,
          };
          await updateMutation.mutateAsync(payload);
          toast.success("서비스가 수정되었습니다");
        }

        router.push("/admin/services");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다";
        toast.error(message);
      }
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppForm>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>
              {mode === "create" ? "서비스 생성" : "서비스 정보"}
            </CardTitle>
            <CardDescription>
              {mode === "create"
                ? "새로운 서비스를 등록합니다"
                : "서비스 정보를 수정합니다"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form.Fieldset className="space-y-8">
              {/* 기본 정보 섹션 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">기본 정보</h3>
                <div className="space-y-4">
                  <form.AppField name="title">
                    {(field) => (
                      <field.TextField
                        label="서비스 제목"
                        required
                        disabled={isLoading}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="subtitle">
                    {(field) => (
                      <field.TextField
                        label="부제목 (선택)"
                        disabled={isLoading}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="category">
                    {(field) => (
                      <field.SelectField
                        label="카테고리"
                        options={CATEGORY_OPTIONS}
                        disabled={isLoading}
                      />
                    )}
                  </form.AppField>
                </div>
              </div>

              {/* 튜터 정보 섹션 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">튜터 정보</h3>
                <form.AppField name="tutorInfo">
                  {(field) => (
                    <field.TextField
                      label="튜터 정보"
                      required
                      disabled={isLoading}
                    />
                  )}
                </form.AppField>
              </div>

              {/* 미디어 섹션 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">미디어</h3>
                <div className="space-y-4">
                  <form.AppField name="coverImage">
                    {(field) => (
                      <field.ImageField
                        label="커버 이미지"
                        aspectRatio="16/9"
                        required
                        disabled={isLoading}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="coverVideo">
                    {(field) => (
                      <field.VideoField
                        label="커버 영상 (선택)"
                        disabled={isLoading}
                      />
                    )}
                  </form.AppField>
                </div>
              </div>

              {/* 설명 섹션 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">서비스 설명</h3>
                <form.AppField name="description">
                  {(field) => (
                    <field.TiptapField label="상세 설명" required />
                  )}
                </form.AppField>
              </div>

              {/* 가격 정보 섹션 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">가격 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <form.AppField name="price">
                    {(field) => (
                      <field.NumberField
                        label="정가"
                        step={1000}
                        min={0}
                        required
                        disabled={isLoading}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="salePrice">
                    {(field) => (
                      <field.NumberField
                        label="할인가 (선택)"
                        step={1000}
                        min={0}
                        disabled={isLoading}
                      />
                    )}
                  </form.AppField>
                </div>
              </div>
            </form.Fieldset>
          </CardContent>

          <CardFooter className="border-t bg-muted/30 justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              취소
            </Button>
            <form.SubmitButton>
              {isLoading
                ? mode === "create"
                  ? "생성 중..."
                  : "수정 중..."
                : mode === "create"
                  ? "생성"
                  : "수정"}
            </form.SubmitButton>
          </CardFooter>
        </Card>
      </form.AppForm>
    </form>
  );
};
