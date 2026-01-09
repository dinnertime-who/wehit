import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "./_core";
import { service } from "./service.schema";
import { user } from "./auth.schema";

export const review = pgTable("review", {
  id: cuidPrimaryKey(),
  serviceId: text("service_id")
    .notNull()
    .references(() => service.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }), // Optional
  writerName: text("writer_name").notNull(), // 리뷰 작성자 이름
  rating: integer("rating").notNull(), // 1-5
  content: text("content").notNull(),
  isBest: boolean("is_best").notNull().default(false), // 베스트 리뷰 여부
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
