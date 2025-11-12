import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { banner, bannerItem } from "@/infrastructure/db/schema";
import {
  MAIN_HERO_BANNER_SLUG,
  MIDDLE_BANNER_SLUG,
  WEEKLY_TREND_BANNER_SLUG,
} from "@/shared/constants/banner.constant";

// Unsplash 이미지 URL (1920x400 크기의 배너용 이미지)
const mainHeroBannerImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1762255421012-9fd499621e7e?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1762255421012-9fd499621e7e?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=370&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&h=370&fit=crop",
];

const mainHeroBannerItemNames = [
  "[블로그]",
  "[유튜브]",
  "[인스타그램]",
  "[틱톡]",
];

// Unsplash 이미지 URL (1200x400 크기의 중간 배너용 이미지)
const middleBannerImages = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=400&fit=crop",
];

export async function seedBanner() {
  try {
    console.log("🌱 Seeding banner data...");

    // 1. Delete existing banners (cascade delete banner_items)
    await db.delete(banner).where(eq(banner.slug, MAIN_HERO_BANNER_SLUG));
    await db.delete(banner).where(eq(banner.slug, MIDDLE_BANNER_SLUG));
    await db.delete(banner).where(eq(banner.slug, WEEKLY_TREND_BANNER_SLUG));
    console.log("✓ Cleared existing banner data");

    // 2. Create main hero banner
    const [createdMainBanner] = await db
      .insert(banner)
      .values({
        slug: MAIN_HERO_BANNER_SLUG,
        widthRatio: 1280,
        heightRatio: 370,
        displayDevice: "all",
      })
      .returning();

    console.log(`✓ Created banner: ${createdMainBanner.slug}`);

    // 3. Create main hero banner items
    const mainBannerItemsToInsert = mainHeroBannerImages.map(
      (imageUrl, index) => ({
        bannerId: createdMainBanner.id,
        imageUrl,
        linkUrl: "/",
        order: index,
        name: mainHeroBannerItemNames[
          Math.floor(Math.random() * mainHeroBannerItemNames.length)
        ],
        backgroundColor:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0"),
      }),
    );

    const createdMainItems = await db
      .insert(bannerItem)
      .values(mainBannerItemsToInsert)
      .returning();

    console.log(`✓ Created ${createdMainItems.length} main hero banner items`);

    // 4. Create middle banner
    const [createdMiddleBanner] = await db
      .insert(banner)
      .values({
        slug: MIDDLE_BANNER_SLUG,
        widthRatio: 1200,
        heightRatio: 400,
        displayDevice: "all",
      })
      .returning();

    console.log(`✓ Created banner: ${createdMiddleBanner.slug}`);

    // 5. Create middle banner items
    const middleBannerItemsToInsert = middleBannerImages.map(
      (imageUrl, index) => ({
        bannerId: createdMiddleBanner.id,
        imageUrl,
        linkUrl: "/",
        order: index,
      }),
    );

    const createdMiddleItems = await db
      .insert(bannerItem)
      .values(middleBannerItemsToInsert)
      .returning();

    console.log(`✓ Created ${createdMiddleItems.length} middle banner items`);

    // 6. Create weekly trend banner
    const [createdWeeklyTrendBanner] = await db
      .insert(banner)
      .values({
        slug: WEEKLY_TREND_BANNER_SLUG,
        widthRatio: 300,
        heightRatio: 400,
        displayDevice: "all",
      })
      .returning();

    console.log(`✓ Created banner: ${createdWeeklyTrendBanner.slug}`);

    // 7. Create weekly trend banner items (4 items)
    const weeklyTrendBannerItems = [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        linkUrl: "/service",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        linkUrl: "/service",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        linkUrl: "/service",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        linkUrl: "/service",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        linkUrl: "/service",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        linkUrl: "/service",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        linkUrl: "/service",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=400&fit=crop",
        videoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        linkUrl: "/service",
      },
    ];

    const weeklyTrendBannerItemsToInsert = weeklyTrendBannerItems.map(
      (item, index) => ({
        bannerId: createdWeeklyTrendBanner.id,
        imageUrl: item.imageUrl,
        videoUrl: item.videoUrl,
        linkUrl: item.linkUrl,
        order: index,
      }),
    );

    const createdWeeklyTrendItems = await db
      .insert(bannerItem)
      .values(weeklyTrendBannerItemsToInsert)
      .returning();

    console.log(
      `✓ Created ${createdWeeklyTrendItems.length} weekly trend banner items`,
    );
    console.log("✅ Banner seed completed successfully");

    return {
      mainBanner: { banner: createdMainBanner, items: createdMainItems },
      middleBanner: {
        banner: createdMiddleBanner,
        items: createdMiddleItems,
      },
      weeklyTrendBanner: {
        banner: createdWeeklyTrendBanner,
        items: createdWeeklyTrendItems,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding banner data:", error);
    throw error;
  }
}
