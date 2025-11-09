import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { review } from "@/infrastructure/db/schema";
import type {
  CreateReviewDTO,
  UpdateReviewDTO,
  Review,
} from "@/shared/types/review.type";

export class ReviewRepository {
  static async create(data: CreateReviewDTO): Promise<Review> {
    const [result] = await db.insert(review).values(data).returning();
    return result as Review;
  }

  static async getById(id: string): Promise<Review | null> {
    const result = await db.query.review.findFirst({
      where: eq(review.id, id),
    });
    return result as Review | null;
  }

  static async getByServiceId(serviceId: string): Promise<Review[]> {
    const results = await db.query.review.findMany({
      where: eq(review.serviceId, serviceId),
    });
    return results as Review[];
  }

  static async update(
    id: string,
    data: UpdateReviewDTO,
  ): Promise<Review | null> {
    const [result] = await db
      .update(review)
      .set(data)
      .where(eq(review.id, id))
      .returning();
    return result as Review | null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(review).where(eq(review.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
