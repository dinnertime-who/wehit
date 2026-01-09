import { NextRequest, NextResponse } from "next/server";
import { ServiceScheduleRepository } from "@/features/service/repositories/service-schedule.repository";
import { updateServiceScheduleSchema } from "@/features/service/schemas/service.schema";
import type { UpdateServiceScheduleDTO } from "@/shared/types/service.type";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scheduleId: string }> },
) {
  try {
    const { scheduleId } = await params;
    const schedule = await ServiceScheduleRepository.getById(scheduleId);

    if (!schedule) {
      return NextResponse.json(
        { error: "스케줄을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    return NextResponse.json(
      { error: "스케줄 조회 실패" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scheduleId: string }> },
) {
  try {
    const { scheduleId } = await params;
    const body = await request.json();

    const validatedData = updateServiceScheduleSchema.parse(
      body,
    ) as UpdateServiceScheduleDTO;

    const schedule = await ServiceScheduleRepository.update(
      scheduleId,
      validatedData,
    );

    if (!schedule) {
      return NextResponse.json(
        { error: "스케줄을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Failed to update schedule:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "스케줄 수정 실패" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scheduleId: string }> },
) {
  try {
    const { scheduleId } = await params;
    const success = await ServiceScheduleRepository.delete(scheduleId);

    if (!success) {
      return NextResponse.json(
        { error: "스케줄을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    return NextResponse.json(
      { error: "스케줄 삭제 실패" },
      { status: 500 },
    );
  }
}
