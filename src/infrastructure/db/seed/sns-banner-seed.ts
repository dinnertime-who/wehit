import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import { SNS_BANNER_SLUG } from "@/shared/constants/banner.constant";

const snsBannerItems = [
  {
    name: "Instagram",
    imageUrl: "/icons/instagram.png",
    linkUrl: "/",
  },
  {
    name: "Facebook",
    imageUrl: "/icons/facebook.png",
    linkUrl: "/",
  },
  {
    name: "Youtube",
    imageUrl: "/icons/youtube.png",
    linkUrl: "/",
  },
  {
    name: "TikTok",
    imageUrl: "/icons/tiktok.png",
    linkUrl: "/",
  },
];

export async function seedSnsBanner() {
  try {
    console.log("🌱 Seeding category banner data...");

    // 1. Delete existing category banner (cascade delete banner_items)
    await db.delete(banner).where(eq(banner.slug, SNS_BANNER_SLUG));
    console.log("✓ Cleared existing category banner data");

    // 2. Create category banner
    const [createdSnsBanner] = await db
      .insert(banner)
      .values({
        slug: SNS_BANNER_SLUG,
        widthRatio: 84,
        heightRatio: 84,
        displayDevice: "all",
        name: "SNS",
      })
      .returning();

    console.log(`✓ Created banner: ${createdSnsBanner.slug}`);

    // 3. Create category banner items
    const snsBannerItemsToInsert = snsBannerItems.map((item, index) => ({
      bannerId: createdSnsBanner.id,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      name: item.name,
      order: index,
    }));

    const createdSnsItems = await db
      .insert(bannerItem)
      .values(snsBannerItemsToInsert)
      .returning();

    console.log(`✓ Created ${createdSnsItems.length} sns banner items`);
    console.log("✅ Category banner seed completed successfully");

    return {
      categoryBanner: {
        banner: createdSnsBanner,
        items: createdSnsItems,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding category banner data:", error);
    throw error;
  }
}
