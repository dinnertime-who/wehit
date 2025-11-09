import { type NextRequest, NextResponse } from "next/server";
import { updateDisplaySchema } from "@/features/display/schemas/display.schema";
import { DisplayService } from "@/features/display/services/display.service";

// TODO: 권한 검증 추가 (admin only)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/displays/[id]">,
) {
  try {
    const { id } = await params;
    const service = new DisplayService();
    const display = await service.getDisplayWithServices(id);

    if (!display) {
      return NextResponse.json(
        { error: "Display not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(display);
  } catch (error) {
    console.error("Failed to fetch display:", error);
    return NextResponse.json(
      { error: "Failed to fetch display" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteContext<"/api/displays/[id]">,
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateDisplaySchema.parse(body);

    const service = new DisplayService();
    const display = await service.updateDisplay(id, validatedData);

    return NextResponse.json(display);
  } catch (error) {
    console.error("Failed to update display:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update display" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/displays/[id]">,
) {
  try {
    const { id } = await params;
    const service = new DisplayService();

    // Check if display exists
    const display = await service.getDisplay(id);
    if (!display) {
      return NextResponse.json(
        { error: "Display not found" },
        { status: 404 },
      );
    }

    await service.deleteDisplay(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete display:", error);
    return NextResponse.json(
      { error: "Failed to delete display" },
      { status: 500 },
    );
  }
}
