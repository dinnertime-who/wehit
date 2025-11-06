"use client";

import { FaGoogle } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/apis/auth/use-auth";

export function OAuthButtons() {
  const { oauth } = useAuth();

  return (
    <div className="space-y-3 w-full">
      {/* Google OAuth */}
      <Button
        onClick={() => oauth.mutateAsync("google")}
        disabled={oauth.isPending}
        variant="outline"
        className="w-full h-11 rounded-lg cursor-pointer border border-line-normal bg-white hover:bg-gray-50"
      >
        <FaGoogle className="w-5 h-5 mr-2" />
        Google로 계속하기
      </Button>

      {/* Kakao OAuth */}
      <Button
        onClick={() => oauth.mutateAsync("kakao")}
        disabled={oauth.isPending}
        className="w-full h-11 rounded-lg cursor-pointer bg-[#FEE500] text-[#000000] hover:bg-[#FDD835]"
      >
        <RiKakaoTalkFill className="w-5 h-5 mr-2" />
        카카오로 계속하기
      </Button>

      {/* Naver OAuth */}
      <Button
        onClick={() => oauth.mutateAsync("naver")}
        disabled={oauth.isPending}
        className="w-full h-11 rounded-lg cursor-pointer bg-[#00C73C] text-white hover:bg-[#00B833]"
      >
        <SiNaver className="w-5 h-5 mr-2" />
        네이버로 계속하기
      </Button>
    </div>
  );
}
