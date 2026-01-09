import { boolean, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const servicePlan = pgTable("service_plan", {
  id: cuidPrimaryKey(),
  serviceId: text("service_id")
    .notNull()
    .references(() => service.id, { onDelete: "cascade" }),
  planType: text("plan_type").notNull(), // STANDARD, DELUXE, PREMIUM
  price: integer("price").notNull(),
  title: text("title"), // nullable
  description: text("description"), // nullable
  hasVAT: boolean("has_vat").notNull().default(true),
  details: jsonb("details").notNull(), // features, shootingTime, imageCount, workingDays, revisionCount
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// Relations
export const serviceRelations = relations(service, ({ many }) => ({
  plans: many(servicePlan),
}));

export const servicePlanRelations = relations(servicePlan, ({ one }) => ({
  service: one(service, {
    fields: [servicePlan.serviceId],
    references: [service.id],
  }),
}));
