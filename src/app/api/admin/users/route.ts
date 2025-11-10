import { NextResponse } from "next/server";
import { db } from "@/infrastructure/db/drizzle";
import { user } from "@/infrastructure/db/schema";

export async function GET() {
  try {
    const users = await db.query.user.findMany({
      orderBy: (user, { desc }) => [desc(user.createdAt)],
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

