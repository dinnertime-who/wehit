import Link from "next/link";
import { OAuthButtons } from "@/components/reusable/platform/oauth-buttons";
import { SignUpForm } from "@/components/reusable/platform/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen py-20 items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-2 text-sm text-gray-600">
            새 계정을 만들어 시작해보세요
          </p>
        </div>

        {/* 콘텐츠 */}
        <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* OAuth 버튼들 */}
          <div>
            <OAuthButtons />
          </div>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

          {/* 이메일/비밀번호 회원가입 폼 */}
          <SignUpForm />
        </div>

        {/* 푸터 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link
              href={"/sign-in"}
              className="font-medium text-primary hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
