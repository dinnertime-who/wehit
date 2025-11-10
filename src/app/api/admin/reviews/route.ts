import { NextResponse } from "next/server";
import { ReviewRepository } from "@/features/review/repositories/review.repository";

export async function GET() {
  try {
    const reviews = await ReviewRepository.getAll();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

