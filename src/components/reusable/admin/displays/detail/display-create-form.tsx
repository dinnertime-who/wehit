"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateDisplay } from "@/hooks/apis/displays/use-create-display";
import type { CreateDisplayInput } from "@/shared/types/display.type";

const createDisplaySchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  slug: z
    .string()
    .min(1, "슬러그는 필수입니다")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "슬러그는 소문자, 숫자, 하이픈만 포함 가능합니다"
    ),
});

type CreateDisplayFormValues = z.infer<typeof createDisplaySchema>;

export const DisplayCreateForm = () => {
  const router = useRouter();
  const createMutation = useCreateDisplay();

  const form = useAppForm({
    defaultValues: {
      title: "",
      slug: "",
    } as CreateDisplayFormValues,
    validators: {
      onSubmit: createDisplaySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload: CreateDisplayInput = {
          title: value.title,
          slug: value.slug,
        };
        await createMutation.mutateAsync(payload);
        toast.success("디스플레이가 생성되었습니다");
        router.push("/admin/displays");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다";
        console.error(error);
        toast.error(message);
      }
    },
  });

  const isLoading = createMutation.isPending;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
    >
      <form.AppForm>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>
              새로운 디스플레이의 기본 정보를 입력합니다
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form.Fieldset className="space-y-6">
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    label="디스플레이 제목"
                    required
                    disabled={isLoading}
                  />
                )}
              </form.AppField>

              <form.AppField name="slug">
                {(field) => (
                  <field.TextField
                    label="슬러그"
                    required
                    disabled={isLoading}
                    placeholder="예: main-hero"
                  />
                )}
              </form.AppField>
            </form.Fieldset>
          </CardContent>

          <CardFooter className="grid grid-cols-2 border-t bg-muted/30 justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              취소
            </Button>
            <form.SubmitButton>
              {isLoading ? "생성 중..." : "생성"}
            </form.SubmitButton>
          </CardFooter>
        </Card>
      </form.AppForm>
    </form>
  );
};
