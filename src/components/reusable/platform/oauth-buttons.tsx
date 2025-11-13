"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaGoogle } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/apis/auth/use-auth";
import { useSession } from "@/hooks/apis/auth/use-session";
import { isProfileCompleted } from "@/utils/user";

export function OAuthButtons() {
  const router = useRouter();
  const { oauth } = useAuth();
  const { data: session, refetch: refetchSession } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // OAuth 로그인 후 세션 체크
  useEffect(() => {
    const checkProfileAfterOAuth = async () => {
      if (session?.user) {
        const user = session.user as {
          phone?: string | null;
          birthDate?: string | Date | null;
          gender?: string | null;
          profileCompleted?: boolean | null;
          role?: string | null;
        };
        if (!isProfileCompleted(user) && user.role !== "admin") {
          router.push("/additional-info");
        }
      }
    };

    checkProfileAfterOAuth();
  }, [session, router]);

  // 컴포넌트 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleOAuthClick = async (provider: "google" | "kakao" | "naver") => {
    await oauth.mutateAsync(provider);
    // OAuth는 서버 사이드 리다이렉트이므로, 리다이렉트 후 세션 체크는 useEffect에서 처리
    // 짧은 딜레이 후 세션을 다시 가져와서 체크
    timeoutRef.current = setTimeout(async () => {
      const sessionResult = await refetchSession();
      const user = sessionResult.data?.user as
        | {
            phone?: string | null;
            birthDate?: string | Date | null;
            gender?: string | null;
            profileCompleted?: boolean | null;
          }
        | undefined;
      if (user && !isProfileCompleted(user)) {
        router.push("/additional-info");
      }
    }, 1000);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Google OAuth */}
      <Button
        onClick={() => handleOAuthClick("google")}
        disabled={oauth.isPending}
        variant="outline"
        className="w-full h-11 rounded-lg cursor-pointer border border-line-normal bg-white hover:bg-gray-50"
      >
        <FaGoogle className="w-5 h-5 mr-2" />
        Google로 계속하기
      </Button>

      {/* Kakao OAuth */}
      <Button
        onClick={() => handleOAuthClick("kakao")}
        disabled={oauth.isPending}
        className="w-full h-11 rounded-lg cursor-pointer bg-[#FEE500] text-[#000000] hover:bg-[#FDD835]"
      >
        <RiKakaoTalkFill className="w-5 h-5 mr-2" />
        카카오로 계속하기
      </Button>

      {/* Naver OAuth */}
      <Button
        onClick={() => handleOAuthClick("naver")}
        disabled={oauth.isPending}
        className="w-full h-11 rounded-lg cursor-pointer bg-[#00C73C] text-white hover:bg-[#00B833]"
      >
        <SiNaver className="w-5 h-5 mr-2" />
        네이버로 계속하기
      </Button>
    </div>
  );
}
