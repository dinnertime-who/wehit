import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { AdditionalInfoForm } from "./_components/additional-info-form";
import { isProfileCompleted } from "@/utils/user";

export const dynamic = "force-dynamic";

export default async function AdditionalInfoPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // 이미 프로필이 완료된 경우 웰컴 페이지로 리다이렉트
  const user = session.user as {
    phone?: string | null;
    birthDate?: string | Date | null;
    gender?: string | null;
    profileCompleted?: boolean | null;
  };
  if (isProfileCompleted(user)) {
    redirect("/welcome");
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">추가 정보 입력</h1>
          <p className="mt-2 text-sm text-gray-600">
            서비스를 이용하기 위해 추가 정보를 입력해주세요
          </p>
        </div>

        {/* 콘텐츠 */}
        <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <AdditionalInfoForm />
        </div>
      </div>
    </div>
  );
}

