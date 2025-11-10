import { type NextRequest, NextResponse } from "next/server";
import { DisplayService } from "@/features/display/services/display.service";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/displays/slug/[slug]">,
) {
  try {
    const { slug } = await params;
    const service = new DisplayService();
    const display = await service.getDisplayWithServiceDetailsBySlug(slug);

    if (!display) {
      return NextResponse.json(
        { error: "Display not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(display);
  } catch (error) {
    console.error("Failed to fetch display by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch display" },
      { status: 500 },
    );
  }
}

