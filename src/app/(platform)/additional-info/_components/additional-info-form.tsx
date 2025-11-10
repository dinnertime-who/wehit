"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { useUpdateProfile } from "@/hooks/apis/users/use-update-profile";

const additionalInfoSchema = z.object({
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(/^[0-9-]+$/, "전화번호 형식이 올바르지 않습니다"),
  birthDate: z.date({ message: "생년월일을 선택해주세요" }),
  gender: z.enum(["male", "female", "other"], {
    message: "성별을 선택해주세요",
  }),
});

export function AdditionalInfoForm() {
  const router = useRouter();
  const updateProfileMutation = useUpdateProfile();

  const form = useAppForm({
    defaultValues: {
      phone: "",
      birthDate: null as Date | null,
      gender: undefined as "male" | "female" | "other" | undefined,
    },
    validators: {
      onSubmit: additionalInfoSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (!value.birthDate || !value.gender) {
          toast.error("모든 필드를 입력해주세요");
          return;
        }

        // Date를 YYYY-MM-DD 형식의 문자열로 변환
        const birthDateString = value.birthDate.toISOString().split("T")[0];

        await updateProfileMutation.mutateAsync({
          phone: value.phone,
          birthDate: birthDateString,
          gender: value.gender,
        });

        toast.success("추가 정보가 저장되었습니다");
        router.push("/welcome");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || "추가 정보 저장에 실패했습니다",
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
      className="space-y-6"
    >
      <form.AppField
        name="phone"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.length === 0) {
              return "전화번호를 입력해주세요";
            }
            if (!/^[0-9-]+$/.test(value)) {
              return "전화번호 형식이 올바르지 않습니다";
            }
          },
        }}
      >
        {(field) => (
          <field.TextField
            label="전화번호"
            placeholder="010-1234-5678"
          />
        )}
      </form.AppField>

      <form.AppField
        name="birthDate"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return "생년월일을 선택해주세요";
            }
          },
        }}
      >
        {(field) => <field.DateField label="생년월일" />}
      </form.AppField>

      <form.AppField
        name="gender"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return "성별을 선택해주세요";
            }
          },
        }}
      >
        {(field) => (
          <field.SelectField
            label="성별"
            options={[
              { value: "male", label: "남성" },
              { value: "female", label: "여성" },
              { value: "other", label: "기타" },
            ]}
            placeholder="성별을 선택해주세요"
          />
        )}
      </form.AppField>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={updateProfileMutation.isPending}
      >
        {updateProfileMutation.isPending ? "저장 중..." : "저장하기"}
      </Button>
    </form>
  );
}

