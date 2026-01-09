import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
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
  // 클래스 정보
  classType: text("class_type", { enum: ["group", "individual", "oneday"] })
    .notNull()
    .default("group"),
  maxParticipants: integer("max_participants").notNull().default(2), // 최대 참여 인원
  duration: integer("duration").notNull().default(2), // 시간/기간
  durationUnit: text("duration_unit", { enum: ["시간", "개월"] })
    .notNull()
    .default("시간"),
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
  salePrice: integer("sale_price"), // 할인가 (nullable)
  title: text("title"), // nullable
  description: text("description"), // nullable
  hasVAT: boolean("has_vat").notNull().default(true),
  details: jsonb("details").notNull(), // features, shootingTime, imageCount, workingDays, revisionCount
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const serviceSchedule = pgTable("service_schedule", {
  id: cuidPrimaryKey(),
  serviceId: text("service_id")
    .notNull()
    .references(() => service.id, { onDelete: "cascade" }),
  scheduleType: text("schedule_type").notNull(), // flexible, fixed
  scheduleDescription: text("schedule_description"), // 스케줄 설명
  location: text("location").notNull(), // 위치
  locationDetail: text("location_detail"), // 상세 위치
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// Relations
export const serviceRelations = relations(service, ({ many }) => ({
  plans: many(servicePlan),
  schedules: many(serviceSchedule),
}));

export const servicePlanRelations = relations(servicePlan, ({ one }) => ({
  service: one(service, {
    fields: [servicePlan.serviceId],
    references: [service.id],
  }),
}));

export const serviceScheduleRelations = relations(
  serviceSchedule,
  ({ one }) => ({
    service: one(service, {
      fields: [serviceSchedule.serviceId],
      references: [service.id],
    }),
  }),
);
