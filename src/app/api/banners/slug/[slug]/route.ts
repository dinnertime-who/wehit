import { type NextRequest, NextResponse } from "next/server";
import { BannerService } from "@/features/banner/services/banner.service";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/banners/slug/[slug]">,
) {
  try {
    const { slug } = await params;
    const service = new BannerService();
    const banner = await service.getBannerBySlug(slug);

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const items = await service.getActiveBannerItems(banner.id);

    return NextResponse.json({
      ...banner,
      items,
    });
  } catch (error) {
    console.error("Failed to fetch banner by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 },
    );
  }
}
