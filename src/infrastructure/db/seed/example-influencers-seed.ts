import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import { EXAMPLE_INFLUENCERS_BANNER_SLUG } from "@/shared/constants/banner.constant";

// 전문가 배너 아이템 데이터
const exampleInfluencersBannerItems = [
  {
    name: "Example Influencer 1",
    imageUrl: "/img1.png",
    linkUrl: "/",
  },
  {
    name: "Example Influencer 2",
    imageUrl: "/img2.png",
    linkUrl: "/",
  },
];

export async function seedExampleInfluencersBanner() {
  try {
    console.log("🌱 Seeding category banner data...");

    // 1. Delete existing category banner (cascade delete banner_items)
    await db
      .delete(banner)
      .where(eq(banner.slug, EXAMPLE_INFLUENCERS_BANNER_SLUG));
    console.log("✓ Cleared existing category banner data");

    // 2. Create category banner
    const [createdExampleInfluencersBanner] = await db
      .insert(banner)
      .values({
        slug: EXAMPLE_INFLUENCERS_BANNER_SLUG,
        widthRatio: 230,
        heightRatio: 300,
        displayDevice: "all",
        name: "Example Influencers",
      })
      .returning();

    console.log(`✓ Created banner: ${createdExampleInfluencersBanner.slug}`);

    // 3. Create category banner items
    const exampleInfluencersBannerItemsToInsert =
      exampleInfluencersBannerItems.map((item, index) => ({
        bannerId: createdExampleInfluencersBanner.id,
        imageUrl: item.imageUrl,
        linkUrl: item.linkUrl,
        name: item.name,
        order: index,
      }));

    const createdExampleInfluencersItems = await db
      .insert(bannerItem)
      .values(exampleInfluencersBannerItemsToInsert)
      .returning();

    console.log(
      `✓ Created ${createdExampleInfluencersItems.length} example influencers banner items`,
    );
    console.log("✅ Category banner seed completed successfully");

    return {
      categoryBanner: {
        banner: createdExampleInfluencersBanner,
        items: createdExampleInfluencersItems,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding category banner data:", error);
    throw error;
  }
}
