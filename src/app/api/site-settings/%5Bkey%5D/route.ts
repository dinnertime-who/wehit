import { type NextRequest, NextResponse } from "next/server";
import { updateSiteSettingSchema } from "@/features/site-setting/schemas/site-setting.schema";
import { SiteSettingRepository } from "@/features/site-setting/repositories/site-setting.repository";

const DEFAULT_ACCOUNT = "0000-0000-0000";

export async function GET(
  _request: NextRequest,
  context: any,
) {
  try {
    const { key } = await context.params;
    const setting = await SiteSettingRepository.getByKey(key);

    // site-account는 기본값이 있음
    if (key === "site-account" && !setting) {
      return NextResponse.json({
        key: "site-account",
        value: DEFAULT_ACCOUNT,
        description: null,
        updatedAt: new Date(),
      });
    }

    if (!setting) {
      return NextResponse.json(
        { error: "설정을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Site setting fetch error:", error);
    return NextResponse.json(
      { error: "설정 조회 실패" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: any,
) {
  try {
    const { key } = await context.params;
    const body = await request.json();
    const validData = updateSiteSettingSchema.parse(body);

    const setting = await SiteSettingRepository.update(key, validData);
    if (!setting) {
      return NextResponse.json(
        { error: "설정을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Site setting update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "설정 수정 실패" },
      { status: 400 },
    );
  }
}
