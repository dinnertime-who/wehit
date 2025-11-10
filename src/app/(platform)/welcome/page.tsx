import Link from "next/link";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* 헤더 */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            환영합니다, {session.user.name}님!
          </h1>
          <p className="text-lg text-gray-600">
            추가 정보 입력이 완료되었습니다.
            <br />
            이제 서비스를 이용하실 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-4">
          <Link
            href="/service"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full font-semibold",
            )}
          >
            서비스 둘러보기
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full font-semibold",
            )}
          >
            메인으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}

