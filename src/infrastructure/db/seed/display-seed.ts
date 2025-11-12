import { db } from "@/infrastructure/db/drizzle";
import { display, displayService, service } from "@/infrastructure/db/schema";
import {
  FEATURED_DISPLAY_SLUG,
  NEW_DISPLAY_SLUG,
  POPULAR_DISPLAY_SLUG,
  RECOMMENDED_DISPLAY_SLUG,
  TRENDING_DISPLAY_SLUG,
} from "@/shared/constants/display.constant";

const displayData = [
  {
    title: "추천 강의",
    slug: RECOMMENDED_DISPLAY_SLUG,
  },
  {
    title: "인기 강의",
    slug: POPULAR_DISPLAY_SLUG,
  },
  {
    title: "신규 강의",
    slug: NEW_DISPLAY_SLUG,
  },
  {
    title: "트렌딩 강의",
    slug: TRENDING_DISPLAY_SLUG,
  },
  {
    title: "특별 기획 강의",
    slug: FEATURED_DISPLAY_SLUG,
  },
];

export async function seedDisplay() {
  try {
    console.log("🌱 Seeding display data...");

    // 1. Get all services
    const services = await db.select().from(service);

    if (services.length === 0) {
      console.log("⚠️ No services found. Please run seedService first.");
      return [];
    }

    // 2. Delete existing displays (cascade delete display_services)
    await db.delete(display);
    console.log("✓ Cleared existing display data");

    // 3. Create displays
    const createdDisplays = await db
      .insert(display)
      .values(displayData)
      .returning();

    console.log(`✓ Created ${createdDisplays.length} displays`);

    // 4. Create display-service relationships
    const displayServicesToInsert: {
      displayId: string;
      serviceId: string;
      order: number;
    }[] = [];

    for (const disp of createdDisplays) {
      // 각 display에 12개의 서비스를 랜덤하게 할당 (40개 서비스 활용)
      const serviceCount = 12;

      // 서비스 배열을 섞어서 랜덤하게 선택
      const shuffledServices = [...services].sort(() => Math.random() - 0.5);
      const selectedServices = shuffledServices.slice(0, serviceCount);

      selectedServices.forEach((svc, index) => {
        displayServicesToInsert.push({
          displayId: disp.id,
          serviceId: svc.id,
          order: index,
        });
      });
    }

    const createdDisplayServices = await db
      .insert(displayService)
      .values(displayServicesToInsert)
      .returning();

    console.log(
      `✓ Created ${createdDisplayServices.length} display-service relationships`,
    );
    console.log("✅ Display seed completed successfully");

    return {
      displays: createdDisplays,
      displayServices: createdDisplayServices,
    };
  } catch (error) {
    console.error("❌ Error seeding display data:", error);
    throw error;
  }
}
