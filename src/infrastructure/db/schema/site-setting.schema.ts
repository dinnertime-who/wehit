import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { updatedAt } from "./_core";

export const siteSetting = pgTable("site_setting", {
  key: text("key").primaryKey(), // 설정 키 (예: "site-account")
  value: text("value").notNull(), // JSON 직렬화된 값
  description: text("description"), // 설명
  updatedAt: updatedAt(),
});
