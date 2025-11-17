import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import { MOBILE_MOCK_BANNER_SLUG } from "@/shared/constants/banner.constant";

const mobileMockBannerItems = [
  {
    name: "Mobile Mock",
    imageUrl: "/smart-phone-mock.png",
    linkUrl: "/",
  },
];

export async function seedMobileMockBanner() {
  try {
    console.log("🌱 Seeding category banner data...");

    // 1. Delete existing category banner (cascade delete banner_items)
    await db.delete(banner).where(eq(banner.slug, MOBILE_MOCK_BANNER_SLUG));
    console.log("✓ Cleared existing category banner data");

    // 2. Create category banner
    const [createdMobileMockBanner] = await db
      .insert(banner)
      .values({
        slug: MOBILE_MOCK_BANNER_SLUG,
        widthRatio: 362,
        heightRatio: 849,
        displayDevice: "all",
        name: "모바일 목업",
      })
      .returning();

    console.log(`✓ Created banner: ${createdMobileMockBanner.slug}`);

    // 3. Create category banner items
    const mobileMockBannerItemsToInsert = mobileMockBannerItems.map(
      (item, index) => ({
        bannerId: createdMobileMockBanner.id,
        imageUrl: item.imageUrl,
        linkUrl: item.linkUrl,
        name: item.name,
        order: index,
      }),
    );

    const createdMobileMockItems = await db
      .insert(bannerItem)
      .values(mobileMockBannerItemsToInsert)
      .returning();

    console.log(
      `✓ Created ${createdMobileMockItems.length} mobile mock banner items`,
    );
    console.log("✅ Category banner seed completed successfully");

    return {
      categoryBanner: {
        banner: createdMobileMockBanner,
        items: createdMobileMockItems,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding category banner data:", error);
    throw error;
  }
}
