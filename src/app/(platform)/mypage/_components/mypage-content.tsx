"use client";

import Link from "next/link";
import { useSession } from "@/hooks/apis/auth/use-session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MyPageContent() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="app-container px-4 py-12">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">로그인이 필요합니다</p>
          <Button asChild>
            <Link href="/sign-in">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const user = session.user;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="app-container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
        <p className="text-muted-foreground">
          내 정보를 확인하고 관리할 수 있습니다
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>내 계정 정보를 확인합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">이메일 인증</span>
                <span className="text-sm font-medium">
                  {user.emailVerified ? "인증됨" : "미인증"}
                </span>
              </div>
              {user.role && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">역할</span>
                  <span className="text-sm font-medium">{user.role}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>주문 및 구매</CardTitle>
            <CardDescription>주문 내역을 확인합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/mypage/purchase-history">
                  구매 내역 보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

