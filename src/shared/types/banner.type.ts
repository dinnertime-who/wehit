import type { banner, bannerItem } from "@/infrastructure/db/schema";

export type DisplayDevice = "mobile" | "desktop" | "all";

export type Banner = typeof banner.$inferSelect;
export type BannerItem = typeof bannerItem.$inferSelect;

export type BannerWithItems = Banner & {
  items: BannerItem[];
};

export type CreateBannerInput = Omit<
  typeof banner.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateBannerInput = Partial<CreateBannerInput>;

export type CreateBannerItemInput = Omit<
  typeof bannerItem.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateBannerItemInput = Partial<CreateBannerItemInput>;
