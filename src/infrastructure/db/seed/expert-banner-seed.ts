import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import { EXPERT_BANNER_SLUG } from "@/shared/constants/banner.constant";

// 전문가 배너 아이템 데이터
const expertBannerItems = [
  {
    name: "Expert 1",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
  {
    name: "Expert 2",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
  {
    name: "Expert 3",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
  {
    name: "Expert 4",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
  {
    name: "Expert 5",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
  {
    name: "Expert 6",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
  {
    name: "Expert 7",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
  {
    name: "Expert 8",
    imageUrl: "/model-1.png",
    linkUrl: "/",
  },
];

export async function seedExpertBanner() {
  try {
    console.log("🌱 Seeding category banner data...");

    // 1. Delete existing category banner (cascade delete banner_items)
    await db.delete(banner).where(eq(banner.slug, EXPERT_BANNER_SLUG));
    console.log("✓ Cleared existing category banner data");

    // 2. Create category banner
    const [createdExpertBanner] = await db
      .insert(banner)
      .values({
        slug: EXPERT_BANNER_SLUG,
        widthRatio: 276,
        heightRatio: 324,
        displayDevice: "all",
        name: "전문가",
      })
      .returning();

    console.log(`✓ Created banner: ${createdExpertBanner.slug}`);

    // 3. Create category banner items
    const expertBannerItemsToInsert = expertBannerItems.map((item, index) => ({
      bannerId: createdExpertBanner.id,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      name: item.name,
      order: index,
    }));

    const createdExpertItems = await db
      .insert(bannerItem)
      .values(expertBannerItemsToInsert)
      .returning();

    console.log(`✓ Created ${createdExpertItems.length} expert banner items`);
    console.log("✅ Category banner seed completed successfully");

    return {
      categoryBanner: {
        banner: createdExpertBanner,
        items: createdExpertItems,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding category banner data:", error);
    throw error;
  }
}
