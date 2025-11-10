import { render } from "@react-email/components";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@/config/env/server";
import { db } from "@/infrastructure/db/drizzle";
import { getRedis } from "@/infrastructure/db/redis";
import { user } from "@/infrastructure/db/schema";
import { transporter } from "@/infrastructure/notification/nodemailer";
import { VerificationCodeEmail } from "@/infrastructure/notification/nodemailer/templates/verification-code-email";
import {
  generateVerificationCode,
  getVerificationKey,
  VERIFICATION_CODE_EXPIRY,
} from "@/utils/verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // 이메일 중복 체크
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    // 인증번호 생성
    const code = generateVerificationCode();
    const redis = getRedis();
    const key = getVerificationKey(email);

    // Redis에 인증번호 저장 (5분 TTL)
    await redis.setex(key, VERIFICATION_CODE_EXPIRY, code);

    // 이메일 발송
    const emailHtml = await render(
      VerificationCodeEmail({
        code,
      }),
    );

    await transporter.sendMail({
      from: serverEnv.SMTP_USER,
      to: email,
      subject: "[WeHit] 이메일 인증번호",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
    });
  } catch (error) {
    console.error("Send verification code error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 },
    );
  }
}
