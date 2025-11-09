import type { display, displayService } from "@/infrastructure/db/schema";
import type { Service } from "./service.type";

export type Display = typeof display.$inferSelect;
export type DisplayServiceRecord = typeof displayService.$inferSelect;

export type DisplayWithServices = Display & {
  services: DisplayServiceRecord[];
};

export type CreateDisplayInput = Omit<
  typeof display.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateDisplayInput = Partial<CreateDisplayInput>;

export type AddServiceToDisplayInput = Omit<
  typeof displayService.$inferInsert,
  "id" | "createdAt"
>;

export type RemoveServiceFromDisplayInput = {
  displayId: string;
  serviceId: string;
};
