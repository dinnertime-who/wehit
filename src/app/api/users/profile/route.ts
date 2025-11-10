import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/infrastructure/db/drizzle";
import { user } from "@/infrastructure/db/schema";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";

const updateProfileSchema = z.object({
  phone: z.string().min(1, "전화번호를 입력해주세요"),
  birthDate: z.string().min(1, "생년월일을 선택해주세요"),
  gender: z.enum(["male", "female", "other"], {
    message: "성별을 선택해주세요",
  }),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // 사용자 프로필 업데이트
    const [updatedUser] = await db
      .update(user)
      .set({
        phone: validatedData.phone,
        birthDate: validatedData.birthDate,
        gender: validatedData.gender,
        profileCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "프로필 업데이트 실패" },
      { status: 500 },
    );
  }
}

