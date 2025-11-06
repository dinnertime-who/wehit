import { type NextRequest, NextResponse } from "next/server";
import { updateBannerItemSchema } from "@/features/banner/schemas/banner.schema";
import { BannerService } from "@/features/banner/services/banner.service";

// TODO: 권한 검증 추가 (admin only)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/banners/items/[itemId]">,
) {
  try {
    const { itemId } = await params;
    const service = new BannerService();
    const item = await service.getBannerItem(itemId);

    if (!item) {
      return NextResponse.json(
        { error: "Banner item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to fetch banner item:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner item" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteContext<"/api/banners/items/[itemId]">,
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const validatedData = updateBannerItemSchema.parse(body);

    const service = new BannerService();
    const item = await service.updateBannerItem(itemId, validatedData);

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update banner item:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update banner item" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/banners/items/[itemId]">,
) {
  try {
    const { itemId } = await params;
    const service = new BannerService();

    // Check if item exists
    const item = await service.getBannerItem(itemId);
    if (!item) {
      return NextResponse.json(
        { error: "Banner item not found" },
        { status: 404 },
      );
    }

    await service.deleteBannerItem(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete banner item:", error);
    return NextResponse.json(
      { error: "Failed to delete banner item" },
      { status: 500 },
    );
  }
}
