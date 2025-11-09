import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "./_core";
import { service } from "./service.schema";

export const display = pgTable("display", {
  id: cuidPrimaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const displayService = pgTable("display_service", {
  id: cuidPrimaryKey(),
  displayId: text("display_id")
    .notNull()
    .references(() => display.id, { onDelete: "cascade" }),
  serviceId: text("service_id")
    .notNull()
    .references(() => service.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  createdAt: createdAt(),
});
