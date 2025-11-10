import { NextResponse } from "next/server";
import { db } from "@/infrastructure/db/drizzle";
import { service, review, user } from "@/infrastructure/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Service count
    const [serviceCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(service);

    // Review count
    const [reviewCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(review);

    // User count
    const [userCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(user);

    // Notice count (schema가 없으므로 0으로 반환)
    const noticeCount = 0;

    return NextResponse.json({
      serviceCount: serviceCount.count,
      reviewCount: reviewCount.count,
      userCount: userCount.count,
      noticeCount,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}

