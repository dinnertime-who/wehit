import { type NextRequest, NextResponse } from "next/server";
import { ServicePlanRepository } from "@/features/service/repositories/service-plan.repository";
import { updateServicePlanSchema } from "@/features/service/schemas/service.schema";
import type { PlanType } from "@/shared/types/service.type";

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/services/[id]/plans/[planType]">,
) {
  try {
    const { id, planType } = await context.params;
    const body = await request.json();
    const validData = updateServicePlanSchema.parse(body);

    const plan = await ServicePlanRepository.update(
      id,
      planType as PlanType,
      validData,
    );

    if (!plan) {
      return NextResponse.json(
        { error: "플랜을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Service plan update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "플랜 수정 실패" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<"/api/services/[id]/plans/[planType]">,
) {
  try {
    const { id, planType } = await context.params;
    const success = await ServicePlanRepository.delete(
      id,
      planType as PlanType,
    );

    if (!success) {
      return NextResponse.json(
        { error: "플랜을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service plan delete error:", error);
    return NextResponse.json(
      { error: "플랜 삭제 실패" },
      { status: 500 },
    );
  }
}
