import { type NextRequest, NextResponse } from "next/server";
import { addServiceToDisplaySchema } from "@/features/display/schemas/display.schema";
import { DisplayService } from "@/features/display/services/display.service";

// TODO: 권한 검증 추가 (admin only)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/displays/[id]/services">,
) {
  try {
    const { id } = await params;
    const service = new DisplayService();
    const displayServices = await service.getDisplayServices(id);

    return NextResponse.json(displayServices);
  } catch (error) {
    console.error("Failed to fetch display services:", error);
    return NextResponse.json(
      { error: "Failed to fetch display services" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function POST(
  request: NextRequest,
  { params }: RouteContext<"/api/displays/[id]/services">,
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = addServiceToDisplaySchema.parse({
      ...body,
      displayId: id,
    });

    const service = new DisplayService();
    const displayService = await service.addServiceToDisplay(validatedData);

    return NextResponse.json(displayService, { status: 201 });
  } catch (error) {
    console.error("Failed to add service to display:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to add service to display" },
      { status: 500 },
    );
  }
}
