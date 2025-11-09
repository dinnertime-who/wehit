import { type NextRequest, NextResponse } from "next/server";
import { createDisplaySchema } from "@/features/display/schemas/display.schema";
import { DisplayService } from "@/features/display/services/display.service";

// TODO: 권한 검증 추가 (admin only)
export async function GET() {
  try {
    const service = new DisplayService();
    const displays = await service.getAllDisplays();
    return NextResponse.json(displays);
  } catch (error) {
    console.error("Failed to fetch displays:", error);
    return NextResponse.json(
      { error: "Failed to fetch displays" },
      { status: 500 },
    );
  }
}

// TODO: 권한 검증 추가 (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createDisplaySchema.parse(body);

    const service = new DisplayService();
    const display = await service.createDisplay(validatedData);

    return NextResponse.json(display, { status: 201 });
  } catch (error) {
    console.error("Failed to create display:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create display" },
      { status: 500 },
    );
  }
}
