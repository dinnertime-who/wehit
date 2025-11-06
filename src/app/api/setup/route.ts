import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/infrastructure/db/drizzle";
import { user } from "@/infrastructure/db/schema/auth.schema";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const hasAdmin = await db.select().from(user).where(eq(user.role, "admin"));

  if (hasAdmin.length > 0) {
    return NextResponse.json(
      { message: "Admin already exists" },
      { status: 400 },
    );
  }

  await auth.api.signUpEmail({
    body: {
      email: "admin@wehit.com",
      password: "wehit@2025",
      name: "Admin",
    },
    headers: await headers(),
  });

  await db
    .update(user)
    .set({
      role: "admin",
    })
    .where(eq(user.email, "admin@wehit.com"));

  return NextResponse.json({ message: "Admin created" }, { status: 200 });
}
