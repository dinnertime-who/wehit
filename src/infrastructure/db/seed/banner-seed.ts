import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import { MAIN_HERO_BANNER_SLUG } from "@/shared/constants/banner.constant";

// Unsplash 이미지 URL (1920x400 크기의 배너용 이미지)
const bannerImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1762255421012-9fd499621e7e?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1920&h=400&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=400&fit=crop",
];

export async function seedBanner() {
  try {
    console.log("🌱 Seeding banner data...");

    // 1. Delete existing banner (cascade delete banner_items)
    await db.delete(banner).where(eq(banner.slug, MAIN_HERO_BANNER_SLUG));
    console.log("✓ Cleared existing banner data");

    // 2. Create main hero banner
    const [createdBanner] = await db
      .insert(banner)
      .values({
        slug: MAIN_HERO_BANNER_SLUG,
        widthRatio: 1920,
        heightRatio: 400,
        displayDevice: "all",
      })
      .returning();

    console.log(`✓ Created banner: ${createdBanner.slug}`);

    // 3. Create banner items
    const bannerItemsToInsert = bannerImages.map((imageUrl, index) => ({
      bannerId: createdBanner.id,
      imageUrl,
      linkUrl: "/",
      order: index,
    }));

    const createdItems = await db
      .insert(bannerItem)
      .values(bannerItemsToInsert)
      .returning();

    console.log(`✓ Created ${createdItems.length} banner items`);
    console.log("✅ Banner seed completed successfully");

    return { banner: createdBanner, items: createdItems };
  } catch (error) {
    console.error("❌ Error seeding banner data:", error);
    throw error;
  }
}
