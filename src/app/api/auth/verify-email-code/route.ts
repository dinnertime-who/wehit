import { type NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/infrastructure/db/redis";
import { getVerificationKey } from "@/utils/verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 },
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // 인증번호 형식 검증 (6자리 숫자)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 },
      );
    }

    const redis = getRedis();
    const key = getVerificationKey(email);

    // Redis에서 인증번호 조회
    const storedCode = await redis.get(key);

    if (!storedCode) {
      return NextResponse.json(
        { error: "Verification code expired or not found" },
        { status: 400 },
      );
    }

    // 인증번호 비교
    if (storedCode !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 },
      );
    }

    // 검증 성공 시 Redis에서 삭제
    await redis.del(key);

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify email code error:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 },
    );
  }
}

