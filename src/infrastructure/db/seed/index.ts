import { seedBanner } from "./banner-seed";

async function main() {
  console.log("\n🚀 Starting database seed...\n");

  try {
    await seedBanner();

    console.log("\n✨ Database seed completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  }
}

main();
