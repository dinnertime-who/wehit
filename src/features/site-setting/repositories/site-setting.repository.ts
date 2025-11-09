import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { siteSetting } from "@/infrastructure/db/schema";
import type {
  CreateSiteSettingDTO,
  UpdateSiteSettingDTO,
  SiteSetting,
} from "@/shared/types/site-setting.type";

export class SiteSettingRepository {
  static async create(data: CreateSiteSettingDTO): Promise<SiteSetting> {
    const [result] = await db.insert(siteSetting).values(data).returning();
    return result as SiteSetting;
  }

  static async getByKey(key: string): Promise<SiteSetting | null> {
    const result = await db.query.siteSetting.findFirst({
      where: eq(siteSetting.key, key),
    });
    return result as SiteSetting | null;
  }

  static async getAll(): Promise<SiteSetting[]> {
    const results = await db.query.siteSetting.findMany();
    return results as SiteSetting[];
  }

  static async update(
    key: string,
    data: UpdateSiteSettingDTO,
  ): Promise<SiteSetting | null> {
    const [result] = await db
      .update(siteSetting)
      .set(data)
      .where(eq(siteSetting.key, key))
      .returning();
    return result as SiteSetting | null;
  }

  static async delete(key: string): Promise<boolean> {
    const result = await db.delete(siteSetting).where(eq(siteSetting.key, key));
    return (result.rowCount ?? 0) > 0;
  }
}
