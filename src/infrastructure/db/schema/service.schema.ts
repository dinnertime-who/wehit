import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "./_core";

export const service = pgTable("service", {
  id: cuidPrimaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  category: text("category").notNull(),
  tutorInfo: text("tutor_info").notNull(), // 튜터 정보 (텍스트)
  coverImageUrl: text("cover_image_url").notNull(),
  coverVideoUrl: text("cover_video_url"), // 선택
  description: text("description").notNull(), // HTML content from Tiptap
  price: integer("price").notNull(),
  salePrice: integer("sale_price"), // 할인가 (선택)
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
