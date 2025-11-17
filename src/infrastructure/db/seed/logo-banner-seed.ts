import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import { LOGO_BANNER_SLUG } from "@/shared/constants/banner.constant";

// 카테고리 배너 아이템 데이터
const logoBannerItems = [
  {
    imageUrl: "/logo.png",
    linkUrl: "/",
    name: "로고",
  },
];

export async function seedLogoBanner() {
  try {
    console.log("🌱 Seeding logo banner data...");

    // 1. Delete existing category banner (cascade delete banner_items)
    await db.delete(banner).where(eq(banner.slug, LOGO_BANNER_SLUG));
    console.log("✓ Cleared existing logo banner data");

    // 2. Create logo banner
    const [createdLogoBanner] = await db
      .insert(banner)
      .values({
        slug: LOGO_BANNER_SLUG,
        widthRatio: 48,
        heightRatio: 32,
        displayDevice: "all",
        name: "로고",
      })
      .returning();

    console.log(`✓ Created banner: ${createdLogoBanner.slug}`);

    // 3. Create logo banner items
    const logoBannerItemsToInsert = logoBannerItems.map((item, index) => ({
      bannerId: createdLogoBanner.id,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      name: item.name,
      order: index,
    }));

    const createdLogoItems = await db
      .insert(bannerItem)
      .values(logoBannerItemsToInsert)
      .returning();

    console.log(`✓ Created ${createdLogoItems.length} logo banner items`);
    console.log("✅ Logo banner seed completed successfully");

    return {
      logoBanner: {
        banner: createdLogoBanner,
        items: createdLogoItems,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding logo banner data:", error);
    throw error;
  }
}
