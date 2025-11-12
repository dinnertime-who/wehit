import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "./_core";

export const displayDeviceEnum = pgEnum("display_device", [
  "mobile",
  "desktop",
  "all",
]);

export const banner = pgTable("banner", {
  id: cuidPrimaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name"),
  widthRatio: integer("width_ratio").notNull(),
  heightRatio: integer("height_ratio").notNull(),
  displayDevice: displayDeviceEnum("display_device").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const bannerItem = pgTable("banner_item", {
  id: cuidPrimaryKey(),
  bannerId: text("banner_id")
    .notNull()
    .references(() => banner.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"), // 영상 URL (선택)
  name: text("name"),
  linkUrl: text("link_url").notNull(),
  order: integer("order").notNull(),
  viewStartDate: timestamp("view_start_date"),
  viewEndDate: timestamp("view_end_date"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
