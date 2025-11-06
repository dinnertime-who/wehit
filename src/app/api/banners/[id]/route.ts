import { type NextRequest, NextResponse } from "next/server";
import { updateBannerSchema } from "@/features/banner/schemas/banner.schema";
import { BannerService } from "@/features/banner/services/banner.service";

// TODO: 권한 검증 추가 (admin only)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/banners/[id]">,
) {
  try {
    const { id } = await params;
    const service = new BannerService();
    const banner = await service.getBanner(id);

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Failed to fetch banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteContext<"/api/banners/[id]">,
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateBannerSchema.parse(body);

    const service = new BannerService();
    const banner = await service.updateBanner(id, validatedData);

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Failed to update banner:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/banners/[id]">,
) {
  try {
    const { id } = await params;
    const service = new BannerService();

    // Check if banner exists
    const banner = await service.getBanner(id);
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    await service.deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 },
    );
  }
}
