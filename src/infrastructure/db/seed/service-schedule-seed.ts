import { db } from "@/infrastructure/db/drizzle";
import { serviceSchedule } from "@/infrastructure/db/schema";

const locations = [
  "강남",
  "홍대",
  "신촌",
  "잠실",
  "건대",
  "판교",
  "분당",
  "수원",
  "인천",
  "부천",
];

const locationDetails = [
  "스터디룸",
  "카페",
  "공유 오피스",
  "강의실",
  "작업실",
  "",
];

export async function seedServiceSchedules() {
  try {
    console.log("🌱 Seeding service schedule data...");

    // 1. Delete existing service schedules
    await db.delete(serviceSchedule);
    console.log("✓ Cleared existing service schedule data");

    // 2. Get all services
    const services = await db.query.service.findMany();
    console.log(`✓ Found ${services.length} services`);

    // 3. Create schedules for each service (1개만 생성)
    const scheduleData = [];
    for (const svc of services) {
      const scheduleType = Math.random() > 0.5 ? "flexible" : "fixed";
      const location = locations[Math.floor(Math.random() * locations.length)];
      const locationDetail = locationDetails[Math.floor(Math.random() * locationDetails.length)];
      
      let scheduleDescription = "";
      if (scheduleType === "flexible") {
        scheduleDescription = "메세지로 조율해요";
      } else {
        const days = ["월", "화", "수", "목", "금", "토", "일"];
        const randomDays = days.sort(() => 0.5 - Math.random()).slice(0, 2);
        const hour = Math.floor(Math.random() * 12) + 9; // 9-20시
        scheduleDescription = `매주 ${randomDays.join(", ")} ${hour}:00`;
      }

      scheduleData.push({
        serviceId: svc.id,
        scheduleType,
        scheduleDescription,
        location,
        locationDetail: locationDetail || null,
      });
    }

    // 4. Insert all schedules
    if (scheduleData.length > 0) {
      await db.insert(serviceSchedule).values(scheduleData);
      console.log(`✓ Created ${scheduleData.length} service schedules`);
    }

    console.log("✅ Service schedule seed completed successfully");
  } catch (error) {
    console.error("❌ Error seeding service schedule data:", error);
    throw error;
  }
}
