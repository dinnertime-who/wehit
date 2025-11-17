import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import { CATEGORY_BANNER_SLUG } from "@/shared/constants/banner.constant";

// 카테고리 배너 아이템 데이터
const categoryBannerItems = [
  {
    name: "디자인",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=64&h=64&fit=crop",
    linkUrl: "/service?category=design",
  },
  {
    name: "IT·프로그래밍",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=64&h=64&fit=crop",
    linkUrl: "/service?category=programming",
  },
  {
    name: "영상·사진·음악",
    imageUrl:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=64&h=64&fit=crop",
    linkUrl: "/service?category=media",
  },
  {
    name: "마케팅",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop",
    linkUrl: "/service?category=marketing",
  },
  {
    name: "문서·글쓰기",
    imageUrl:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=64&h=64&fit=crop",
    linkUrl: "/service?category=writing",
  },
  {
    name: "창업·사업",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=64&h=64&fit=crop",
    linkUrl: "/service?category=business",
  },
  {
    name: "세무·법무·노무",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=64&h=64&fit=crop",
    linkUrl: "/service?category=accounting",
  },
  {
    name: "전자책",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=64&h=64&fit=crop",
    linkUrl: "/service?category=ebook",
  },
  {
    name: "AI서비스",
    imageUrl:
      "https://images.unsplash.com/photo-1762255421012-9fd499621e7e?w=64&h=64&fit=crop",
    linkUrl: "/service?category=ai",
  },
];

export async function seedCategoryBanner() {
  try {
    console.log("🌱 Seeding category banner data...");

    // 1. Delete existing category banner (cascade delete banner_items)
    await db.delete(banner).where(eq(banner.slug, CATEGORY_BANNER_SLUG));
    console.log("✓ Cleared existing category banner data");

    // 2. Create category banner
    const [createdCategoryBanner] = await db
      .insert(banner)
      .values({
        slug: CATEGORY_BANNER_SLUG,
        widthRatio: 64,
        heightRatio: 64,
        displayDevice: "all",
        name: "카테고리",
      })
      .returning();

    console.log(`✓ Created banner: ${createdCategoryBanner.slug}`);

    // 3. Create category banner items
    const categoryBannerItemsToInsert = categoryBannerItems.map(
      (item, index) => ({
        bannerId: createdCategoryBanner.id,
        imageUrl: item.imageUrl,
        linkUrl: item.linkUrl,
        name: item.name,
        order: index,
      }),
    );

    const createdCategoryItems = await db
      .insert(bannerItem)
      .values(categoryBannerItemsToInsert)
      .returning();

    console.log(
      `✓ Created ${createdCategoryItems.length} category banner items`,
    );
    console.log("✅ Category banner seed completed successfully");

    return {
      categoryBanner: {
        banner: createdCategoryBanner,
        items: createdCategoryItems,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding category banner data:", error);
    throw error;
  }
}
