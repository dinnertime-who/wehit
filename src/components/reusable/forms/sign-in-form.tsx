"use client";

import { useForm } from "@tanstack/react-form";
import type Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/apis/auth/use-auth";

type Props = {
  redirectTo?: React.ComponentProps<typeof Link>["href"];
  onSuccess?: () => void;
};

const signInSchema = z.object({
  email: z.email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

export const SignInAppForm = ({ redirectTo, onSuccess }: Props) => {
  const router = useRouter();
  const { emailPassword } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await emailPassword.mutateAsync(value);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("로그인 성공했습니다");
      onSuccess?.();

      if (redirectTo) {
        router.push(redirectTo as any);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={emailPassword.isPending}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={emailPassword.isPending}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <Button
        type="submit"
        className="w-full"
        disabled={emailPassword.isPending || !form.state.isFormValid}
      >
        {emailPassword.isPending && <Spinner className="mr-2 h-4 w-4" />}
        {emailPassword.isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
};
