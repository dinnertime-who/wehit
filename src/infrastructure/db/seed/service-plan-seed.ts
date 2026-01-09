import { db } from "@/infrastructure/db/drizzle";
import { servicePlan } from "@/infrastructure/db/schema";
import type { PlanDetails } from "@/shared/types/service.type";

// 플랜별 기본 템플릿
const planTemplates: Record<
  "STANDARD" | "DELUXE" | "PREMIUM",
  {
    title: string;
    description: string;
    basePrice: number;
    details: PlanDetails;
  }
> = {
  STANDARD: {
    title: "스탠다드 플랜",
    description: "기본적인 서비스를 제공하는 플랜입니다.",
    basePrice: 89000,
    details: {
      features: {
        canRetouch: true,
        canPostprocess: false,
      },
      shootingTime: 30,
      imageCount: 1,
      workingDays: 7,
      revisionCount: 1,
    },
  },
  DELUXE: {
    title: "디럭스 플랜",
    description: "고품질 서비스와 전문 보정을 제공하는 플랜입니다.",
    basePrice: 129000,
    details: {
      features: {
        canRetouch: true,
        canPostprocess: true,
      },
      shootingTime: 60,
      imageCount: 3,
      workingDays: 5,
      revisionCount: 2,
    },
  },
  PREMIUM: {
    title: "프리미엄 플랜",
    description: "최상의 서비스와 무제한 보정을 제공하는 플랜입니다.",
    basePrice: 179000,
    details: {
      features: {
        canRetouch: true,
        canPostprocess: true,
      },
      shootingTime: 120,
      imageCount: 5,
      workingDays: 3,
      revisionCount: 5,
    },
  },
};

export async function seedServicePlans() {
  try {
    console.log("🌱 Seeding service plan data...");

    // 1. Delete existing service plans
    await db.delete(servicePlan);
    console.log("✓ Cleared existing service plan data");

    // 2. Get all services
    const services = await db.query.service.findMany();
    console.log(`✓ Found ${services.length} services`);

    // 3. Create plans for each service
    const planData = [];
    for (const svc of services) {
      for (const [planType, template] of Object.entries(planTemplates)) {
        // Add some variation to prices based on service category
        let priceVariation = 0;
        if (svc.category === "design") {
          priceVariation = 10000;
        } else if (svc.category === "marketing") {
          priceVariation = 20000;
        } else if (svc.category === "business") {
          priceVariation = 30000;
        }

        planData.push({
          serviceId: svc.id,
          planType: planType,
          price: template.basePrice + priceVariation,
          title: template.title,
          description: template.description,
          hasVAT: true,
          details: template.details,
        });
      }
    }

    // 4. Insert all plans
    if (planData.length > 0) {
      await db.insert(servicePlan).values(planData);
      console.log(`✓ Created ${planData.length} service plans`);
    }

    console.log("✅ Service plan seed completed successfully");
  } catch (error) {
    console.error("❌ Error seeding service plan data:", error);
    throw error;
  }
}
