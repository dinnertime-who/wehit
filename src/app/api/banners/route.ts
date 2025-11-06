import { type NextRequest, NextResponse } from "next/server";
import { createBannerSchema } from "@/features/banner/schemas/banner.schema";
import { BannerService } from "@/features/banner/services/banner.service";

// TODO: 권한 검증 추가 (admin only)
export async function GET() {
  try {
    const service = new BannerService();
    const banners = await service.getAllBanners();
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBannerSchema.parse(body);

    const service = new BannerService();
    const banner = await service.createBanner(validatedData);

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Failed to create banner:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 },
    );
  }
}
