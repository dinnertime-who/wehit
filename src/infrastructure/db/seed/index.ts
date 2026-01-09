import { seedServicePlans } from "./service-plan-seed";
import { seedServiceSchedules } from "./service-schedule-seed";

async function main() {
  console.log("\n🚀 Starting database seed...\n");

  try {
    // await seedBanner();
    // await seedService();
    // await seedServicePlans(); // Run after seedService
    // await seedServiceSchedules(); // Run after seedService
    // await seedReview();
    // await seedDisplay();
    // await seedCategoryBanner();
    // await seedLogoBanner();
    // await seedExpertBanner();
    // await seedSnsBanner();
    // await seedMobileMockBanner();
    // await seedExampleInfluencersBanner();

    await seedServicePlans();
    await seedServiceSchedules();

    console.log("\n✨ Database seed completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  }
}

main();
