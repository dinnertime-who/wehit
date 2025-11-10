import { type NextRequest, NextResponse } from "next/server";
import { createServiceSchema } from "@/features/service/schemas/service.schema";
import { ServiceRepository } from "@/features/service/repositories/service.repository";
import { db } from "@/infrastructure/db/drizzle";
import { service, review } from "@/infrastructure/db/schema";
import { sql, inArray } from "drizzle-orm";
import type { ServiceWithReviewStats } from "@/shared/types/display.type";

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withStats = searchParams.get("withStats") === "true";

    const services = await ServiceRepository.getAll();

    if (!withStats) {
      return NextResponse.json(services);
    }

    // 리뷰 통계 포함
    const serviceIds = services.map((s) => s.id);

    if (serviceIds.length === 0) {
      return NextResponse.json([]);
    }

    // 리뷰 집계 쿼리
    const reviewStats = await db
      .select({
        serviceId: review.serviceId,
        reviewCount: sql<number>`count(*)::int`,
        rating: sql<number>`coalesce(avg(${review.rating})::numeric, 0)`,
      })
      .from(review)
      .where(inArray(review.serviceId, serviceIds))
      .groupBy(review.serviceId);

    // ServiceId를 키로 하는 맵 생성
    const statsMap = new Map(
      reviewStats.map((stat) => {
        const rawRating = Number(stat.rating);
        const roundedRating = Math.round(rawRating * 10) / 10;
        return [
          stat.serviceId,
          {
            reviewCount: stat.reviewCount,
            rating: roundedRating,
          },
        ];
      }),
    );

    // Service 정보와 리뷰 통계 결합
    const servicesWithStats: ServiceWithReviewStats[] = services.map((svc) => ({
      ...svc,
      reviewCount: statsMap.get(svc.id)?.reviewCount ?? 0,
      rating: statsMap.get(svc.id)?.rating ?? 0,
      order: 0, // 목록에서는 order가 필요 없지만 타입을 맞추기 위해
    }));

    return NextResponse.json(servicesWithStats);
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json({ error: "서비스 조회 실패" }, { status: 500 });
  }
}
