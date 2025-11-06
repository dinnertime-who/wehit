import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import type {
  Banner,
  BannerItem,
  CreateBannerInput,
  CreateBannerItemInput,
  UpdateBannerInput,
  UpdateBannerItemInput,
} from "@/shared/types/banner.type";
import type { IBannerRepository } from "../interfaces/banner.interface";

export class BannerRepository implements IBannerRepository {
  async createBanner(data: CreateBannerInput): Promise<Banner> {
    const result = await db.insert(banner).values(data).returning();
    return result[0];
  }

  async getBanner(id: string): Promise<Banner | null> {
    const result = await db.select().from(banner).where(eq(banner.id, id));
    return result[0] ?? null;
  }

  async getBannerBySlug(slug: string): Promise<Banner | null> {
    const result = await db.select().from(banner).where(eq(banner.slug, slug));
    return result[0] ?? null;
  }

  async getAllBanners(): Promise<Banner[]> {
    return db.select().from(banner);
  }

  async updateBanner(id: string, data: UpdateBannerInput): Promise<Banner> {
    const result = await db
      .update(banner)
      .set(data)
      .where(eq(banner.id, id))
      .returning();
    return result[0];
  }

  async deleteBanner(id: string): Promise<void> {
    await db.delete(banner).where(eq(banner.id, id));
  }

  async createBannerItem(data: CreateBannerItemInput): Promise<BannerItem> {
    const result = await db.insert(bannerItem).values(data).returning();
    return result[0];
  }

  async getBannerItem(id: string): Promise<BannerItem | null> {
    const result = await db
      .select()
      .from(bannerItem)
      .where(eq(bannerItem.id, id));
    return result[0] ?? null;
  }

  async getBannerItems(bannerId: string): Promise<BannerItem[]> {
    return db
      .select()
      .from(bannerItem)
      .where(eq(bannerItem.bannerId, bannerId))
      .orderBy(bannerItem.order);
  }

  async updateBannerItem(
    id: string,
    data: UpdateBannerItemInput,
  ): Promise<BannerItem> {
    const result = await db
      .update(bannerItem)
      .set(data)
      .where(eq(bannerItem.id, id))
      .returning();
    return result[0];
  }

  async deleteBannerItem(id: string): Promise<void> {
    await db.delete(bannerItem).where(eq(bannerItem.id, id));
  }
}
