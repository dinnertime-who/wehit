import { type NextRequest, NextResponse } from "next/server";
import { createBannerItemSchema } from "@/features/banner/schemas/banner.schema";
import { BannerService } from "@/features/banner/services/banner.service";

// TODO: 권한 검증 추가 (admin only)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/banners/[id]/items">,
) {
  try {
    const { id } = await params;
    const service = new BannerService();
    const items = (await service.getBannerWithItems(id))?.items ?? [];

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch banner items:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner items" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function POST(
  request: NextRequest,
  { params }: RouteContext<"/api/banners/[id]/items">,
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createBannerItemSchema.parse({
      ...body,
      bannerId: id,
    });

    const service = new BannerService();
    const item = await service.createBannerItem(validatedData);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create banner item:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create banner item" },
      { status: 500 },
    );
  }
}
