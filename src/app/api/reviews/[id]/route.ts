import { type NextRequest, NextResponse } from "next/server";
import { ReviewRepository } from "@/features/review/repositories/review.repository";
import { updateReviewSchema } from "@/features/review/schemas/review.schema";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validData = updateReviewSchema.parse(body);

    const review = await ReviewRepository.update(id, validData);

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review update error:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "리뷰 수정 실패" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const deleted = await ReviewRepository.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review delete error:", error);
    return NextResponse.json(
      { error: "리뷰 삭제 실패" },
      { status: 500 },
    );
  }
}

