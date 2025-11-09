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
import { useUpdateDisplay } from "@/hooks/apis/displays/use-update-display";
import type { Display } from "@/shared/types/display.type";

const displayMetadataSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  slug: z
    .string()
    .min(1, "슬러그는 필수입니다")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "슬러그는 소문자, 숫자, 하이픈만 포함 가능합니다"),
});

type DisplayMetadataFormValues = z.infer<typeof displayMetadataSchema>;

type Props = {
  display: Display;
};

export const DisplayMetadataForm = ({ display }: Props) => {
  const router = useRouter();
  const updateMutation = useUpdateDisplay(display.id);

  const form = useAppForm({
    defaultValues: {
      title: display.title,
      slug: display.slug,
    } as DisplayMetadataFormValues,
    validators: {
      onSubmit: displayMetadataSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({
          title: value.title,
          slug: value.slug,
        });
        toast.success("디스플레이가 수정되었습니다");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다";
        console.error(error);
        toast.error(message);
      }
    },
  });

  const isLoading = updateMutation.isPending;

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
              디스플레이의 기본 정보를 수정합니다
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
              {isLoading ? "수정 중..." : "수정"}
            </form.SubmitButton>
          </CardFooter>
        </Card>
      </form.AppForm>
    </form>
  );
};
