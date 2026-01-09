import { type NextRequest, NextResponse } from "next/server";
import { ServiceRepository } from "@/features/service/repositories/service.repository";
import { ServicePlanRepository } from "@/features/service/repositories/service-plan.repository";
import { updateServiceSchema } from "@/features/service/schemas/service.schema";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/services/[id]">,
) {
  try {
    const { id } = await context.params;
    const service = await ServiceRepository.getById(id);

    if (!service) {
      return NextResponse.json(
        { error: "서비스를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // Get STANDARD plan price
    const standardPlan = await ServicePlanRepository.getByServiceIdAndPlanType(
      id,
      "STANDARD",
    );

    // Return service with price from STANDARD plan
    const serviceWithPrice = {
      ...service,
      price: standardPlan?.price ?? 0,
      salePrice: standardPlan?.salePrice ?? null,
    };

    return NextResponse.json(serviceWithPrice);
  } catch (error) {
    console.error("Service fetch error:", error);
    return NextResponse.json({ error: "서비스 조회 실패" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validData = updateServiceSchema.parse(body);

    const service = await ServiceRepository.update(id, validData);
    if (!service) {
      return NextResponse.json(
        { error: "서비스를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Service update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "서비스 수정 실패" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const success = await ServiceRepository.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: "서비스를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service delete error:", error);
    return NextResponse.json({ error: "서비스 삭제 실패" }, { status: 500 });
  }
}
