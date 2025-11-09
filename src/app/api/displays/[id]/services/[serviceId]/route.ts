import { type NextRequest, NextResponse } from "next/server";
import { DisplayService } from "@/features/display/services/display.service";

// TODO: 권한 검증 추가 (admin only)
export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: RouteContext<"/api/displays/[id]/services/[serviceId]">,
) {
  try {
    const { id, serviceId } = await params;
    const service = new DisplayService();

    // Check if display exists
    const display = await service.getDisplay(id);
    if (!display) {
      return NextResponse.json(
        { error: "Display not found" },
        { status: 404 },
      );
    }

    await service.removeServiceFromDisplay(id, serviceId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove service from display:", error);
    return NextResponse.json(
      { error: "Failed to remove service from display" },
      { status: 500 },
    );
  }
}
