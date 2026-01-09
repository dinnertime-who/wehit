import { type NextRequest, NextResponse } from "next/server";
import { ServicePlanRepository } from "@/features/service/repositories/service-plan.repository";
import { createServicePlanSchema } from "@/features/service/schemas/service.schema";
import type { PlanType, ServicePlanFormatted } from "@/shared/types/service.type";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/services/[id]/plans">,
) {
  try {
    const { id } = await context.params;
    const plans = await ServicePlanRepository.getByServiceId(id);

    // Transform to frontend-friendly format: Record<PlanType, ServicePlanFormatted>
    const formattedPlans: Record<PlanType, ServicePlanFormatted> = {} as Record<
      PlanType,
      ServicePlanFormatted
    >;

    for (const plan of plans) {
      formattedPlans[plan.planType as PlanType] = {
        price: plan.price,
        salePrice: plan.salePrice,
        title: plan.title,
        description: plan.description,
        hasVAT: plan.hasVAT,
        details: plan.details, // key-value 형태 그대로 반환
      };
    }

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error("Service plans fetch error:", error);
    return NextResponse.json(
      { error: "플랜 조회 실패" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/services/[id]/plans">,
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Add serviceId from URL params
    const validData = createServicePlanSchema.parse({
      ...body,
      serviceId: id,
    });

    const plan = await ServicePlanRepository.create(validData);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Service plan creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "플랜 생성 실패" },
      { status: 400 },
    );
  }
}
