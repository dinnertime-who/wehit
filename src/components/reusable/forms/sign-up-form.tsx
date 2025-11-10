"use client";

import { useState } from "react";
import * as React from "react";
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
import { useCheckEmail } from "@/hooks/apis/auth/use-check-email";
import { useSendVerificationCode } from "@/hooks/apis/auth/use-send-verification-code";
import { useVerifyEmailCode } from "@/hooks/apis/auth/use-verify-email-code";

type Props = {
  redirectTo?: React.ComponentProps<typeof Link>["href"];
  onSuccess?: () => void;
};

const signUpSchema = z
  .object({
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
    email: z.string().email("유효한 이메일을 입력해주세요"),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
    confirmPassword: z.string(),
    verificationCode: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export const SignUpAppForm = ({ redirectTo, onSuccess }: Props) => {
  const router = useRouter();
  const { signUpEmail } = useAuth();
  const [emailForVerification, setEmailForVerification] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const sendCodeMutation = useSendVerificationCode();
  const verifyCodeMutation = useVerifyEmailCode();

  // 이메일 중복 체크를 위한 hook (form 외부에서 관리)
  const [checkEmailValue, setCheckEmailValue] = useState("");
  const emailCheck = useCheckEmail(
    checkEmailValue,
    checkEmailValue.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkEmailValue),
  );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      verificationCode: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      // 이메일 인증 확인
      if (!isEmailVerified || emailForVerification !== value.email) {
        toast.error("이메일 인증을 완료해주세요");
        return;
      }

      const result = await signUpEmail.mutateAsync({
        email: value.email,
        password: value.password,
        name: value.name,
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("회원가입이 완료되었습니다");
      onSuccess?.();

      if (redirectTo) {
        router.push(redirectTo as any);
      }
    },
  });

  const handleSendVerificationCode = async (email: string) => {
    try {
      await sendCodeMutation.mutateAsync({ email });
      setEmailForVerification(email);
      setIsEmailVerified(false);
      setVerificationCode("");
      toast.success("인증번호가 발송되었습니다");
    } catch (error: any) {
      let errorMessage = "인증번호 발송에 실패했습니다";
      if (error?.response) {
        try {
          const errorData = await error.response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // JSON 파싱 실패 시 기본 메시지 사용
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleVerifyCode = async (email: string, code: string) => {
    try {
      const result = await verifyCodeMutation.mutateAsync({ email, code });
      if (result.verified) {
        setIsEmailVerified(true);
        toast.success("이메일 인증이 완료되었습니다");
      }
    } catch (error: any) {
      let errorMessage = "인증번호가 올바르지 않습니다";
      if (error?.response) {
        try {
          const errorData = await error.response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // JSON 파싱 실패 시 기본 메시지 사용
        }
      }
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={signUpEmail.isPending}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {typeof field.state.meta.errors[0] === "string"
                  ? field.state.meta.errors[0]
                  : field.state.meta.errors[0]?.message || "오류가 발생했습니다"}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => {
          const emailValue = field.state.value;

          return (
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    value={field.state.value}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      field.handleChange(newValue);
                      setIsEmailVerified(false);
                      setEmailForVerification("");
                      // debounce는 useCheckEmail hook 내부에서 처리
                      setCheckEmailValue(newValue);
                    }}
                    onBlur={field.handleBlur}
                    disabled={signUpEmail.isPending}
                    className={
                      emailCheck.isSuccess && !emailCheck.data?.available
                        ? "border-red-500"
                        : ""
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                      toast.error("유효한 이메일을 입력해주세요");
                      return;
                    }
                    if (emailCheck.isSuccess && !emailCheck.data?.available) {
                      toast.error("이미 사용 중인 이메일입니다");
                      return;
                    }
                    handleSendVerificationCode(emailValue);
                  }}
                  disabled={
                    sendCodeMutation.isPending ||
                    emailCheck.isLoading ||
                    (emailCheck.isSuccess && !emailCheck.data?.available) ||
                    !emailValue
                  }
                >
                  {sendCodeMutation.isPending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    "인증번호 발송"
                  )}
                </Button>
              </div>
              {emailCheck.isSuccess && !emailCheck.data?.available && (
                <p className="text-sm text-red-500">
                  이미 사용 중인 이메일입니다
                </p>
              )}
              {emailCheck.isSuccess && emailCheck.data?.available && emailValue && (
                <p className="text-sm text-green-600">사용 가능한 이메일입니다</p>
              )}
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {emailForVerification && (
        <div className="space-y-2">
          <Label htmlFor="verificationCode">인증번호</Label>
          <div className="flex gap-2">
            <Input
              id="verificationCode"
              type="text"
              placeholder="6자리 인증번호"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
                form.setFieldValue("verificationCode", value);
              }}
              disabled={signUpEmail.isPending || isEmailVerified}
              maxLength={6}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (verificationCode.length !== 6) {
                  toast.error("6자리 인증번호를 입력해주세요");
                  return;
                }
                handleVerifyCode(emailForVerification, verificationCode);
              }}
              disabled={
                verifyCodeMutation.isPending ||
                verificationCode.length !== 6 ||
                isEmailVerified
              }
            >
              {verifyCodeMutation.isPending ? (
                <Spinner className="h-4 w-4" />
              ) : isEmailVerified ? (
                "인증 완료"
              ) : (
                "인증하기"
              )}
            </Button>
          </div>
          {isEmailVerified && (
            <p className="text-sm text-green-600">이메일 인증이 완료되었습니다</p>
          )}
        </div>
      )}

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
              disabled={signUpEmail.isPending}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {typeof field.state.meta.errors[0] === "string"
                  ? field.state.meta.errors[0]
                  : field.state.meta.errors[0]?.message || "오류가 발생했습니다"}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={signUpEmail.isPending}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500">
                {typeof field.state.meta.errors[0] === "string"
                  ? field.state.meta.errors[0]
                  : field.state.meta.errors[0]?.message || "오류가 발생했습니다"}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <Button
        type="submit"
        className="w-full"
        disabled={
          signUpEmail.isPending ||
          !form.state.isFormValid ||
          !isEmailVerified ||
          emailForVerification !== form.state.values.email
        }
      >
        {signUpEmail.isPending && <Spinner className="mr-2 h-4 w-4" />}
        {signUpEmail.isPending ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
};
