import { NextRequest, NextResponse } from "next/server";
import { ServiceScheduleRepository } from "@/features/service/repositories/service-schedule.repository";
import { createServiceScheduleSchema } from "@/features/service/schemas/service.schema";
import type { CreateServiceScheduleDTO } from "@/shared/types/service.type";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const schedules = await ServiceScheduleRepository.getByServiceId(id);
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    return NextResponse.json(
      { error: "스케줄 조회 실패" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validatedData = createServiceScheduleSchema.parse({
      ...body,
      serviceId: id,
    }) as CreateServiceScheduleDTO;

    const schedule = await ServiceScheduleRepository.create(validatedData);
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Failed to create schedule:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "스케줄 생성 실패" },
      { status: 500 },
    );
  }
}
