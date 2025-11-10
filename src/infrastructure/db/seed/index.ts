import { seedBanner } from "./banner-seed";
import { seedService } from "./service-seed";
import { seedReview } from "./review-seed";
import { seedDisplay } from "./display-seed";

async function main() {
  console.log("\n🚀 Starting database seed...\n");

  try {
    await seedBanner();
    await seedService();
    await seedReview();
    await seedDisplay();

    console.log("\n✨ Database seed completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  }
}

main();
