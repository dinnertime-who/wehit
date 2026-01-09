import type {
  display,
  displayService,
  service,
} from "@/infrastructure/db/schema";
import type { Service } from "./service.type";

export type Display = typeof display.$inferSelect;
export type DisplayServiceRecord = typeof displayService.$inferSelect & {
  service: typeof service.$inferSelect;
};

export type DisplayWithServices = Display & {
  services: DisplayServiceRecord[];
};

export type ServiceWithReviewStats = Service & {
  reviewCount: number;
  rating: number; // 평균 평점
  order: number; // display_service의 order
  price: number;
  salePrice: number | null;
};

export type DisplayWithServiceDetails = Display & {
  services: ServiceWithReviewStats[];
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

export type ReorderDisplayServicesInput = {
  displayId: string;
  items: Array<{
    serviceId: string;
    order: number;
  }>;
};
