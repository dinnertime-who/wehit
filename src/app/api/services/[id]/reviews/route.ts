import { type NextRequest, NextResponse } from "next/server";
import { ReviewRepository } from "@/features/review/repositories/review.repository";
import { createReviewSchema } from "@/features/review/schemas/review.schema";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/services/[id]/reviews">,
) {
  try {
    const { id } = await context.params;
    const reviews = await ReviewRepository.getByServiceId(id);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "리뷰 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validData = createReviewSchema.parse({
      ...body,
      serviceId: id,
    });

    const review = await ReviewRepository.create(validData);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "리뷰 생성 실패" },
      { status: 400 },
    );
  }
}
