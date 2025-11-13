import { type NextRequest, NextResponse } from "next/server";
import { reorderDisplayServicesSchema } from "@/features/display/schemas/display.schema";
import { DisplayService } from "@/features/display/services/display.service";

// TODO: 권한 검증 추가 (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/displays/[id]/services/reorder">,
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = reorderDisplayServicesSchema.parse({
      ...body,
      displayId: id,
    });

    const service = new DisplayService();
    await service.reorderDisplayServices(validatedData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder display services:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to reorder display services" },
      { status: 500 },
    );
  }
}

