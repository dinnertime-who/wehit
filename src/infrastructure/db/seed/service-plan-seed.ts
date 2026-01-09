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
    saleRate: number; // 할인율 (0.0 ~ 1.0)
    details: PlanDetails;
  }
> = {
  STANDARD: {
    title: "스탠다드 플랜",
    description: "기본적인 서비스를 제공하는 플랜입니다.",
    basePrice: 89000,
    saleRate: 0.2, // 20% 할인
    details: {
      "촬영 시간": "30분",
      "이미지 개수": 1,
      "작업 일수": 7,
      "수정 횟수": 1,
      "보정 작업": "기본 보정",
    },
  },
  DELUXE: {
    title: "디럭스 플랜",
    description: "고품질 서비스와 전문 보정을 제공하는 플랜입니다.",
    basePrice: 129000,
    saleRate: 0.25, // 25% 할인
    details: {
      "촬영 시간": "1시간",
      "이미지 개수": 3,
      "작업 일수": 5,
      "수정 횟수": 2,
      "보정 작업": "전문 보정",
      "추가 옵션": "배경 합성",
    },
  },
  PREMIUM: {
    title: "프리미엄 플랜",
    description: "최상의 서비스와 무제한 보정을 제공하는 플랜입니다.",
    basePrice: 179000,
    saleRate: 0.3, // 30% 할인
    details: {
      "촬영 시간": "2시간",
      "이미지 개수": 5,
      "작업 일수": 3,
      "수정 횟수": 5,
      "보정 작업": "고급 보정",
      "추가 옵션": "배경 합성 + 색감 보정",
      "원본 제공": "고해상도 원본",
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

        const price = template.basePrice + priceVariation;
        const salePrice = Math.round(price * (1 - template.saleRate));

        planData.push({
          serviceId: svc.id,
          planType: planType,
          price: price,
          salePrice: salePrice,
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
