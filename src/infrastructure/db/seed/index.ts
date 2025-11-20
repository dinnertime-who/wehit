async function main() {
  console.log("\n🚀 Starting database seed...\n");

  try {
    // await seedBanner();
    // await seedService();
    // await seedReview();
    // await seedDisplay();
    // await seedCategoryBanner();
    // await seedLogoBanner();
    // await seedExpertBanner();
    // await seedSnsBanner();
    // await seedMobileMockBanner();
    // await seedExampleInfluencersBanner();

    console.log("\n✨ Database seed completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  }
}

main();
