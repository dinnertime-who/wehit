import { type NextRequest, NextResponse } from "next/server";
import { createServiceSchema } from "@/features/service/schemas/service.schema";
import { ServiceRepository } from "@/features/service/repositories/service.repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validData = createServiceSchema.parse(body);
    const result = await ServiceRepository.create(validData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Service creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "서비스 생성 실패" },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    const services = await ServiceRepository.getAll();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json({ error: "서비스 조회 실패" }, { status: 500 });
  }
}
