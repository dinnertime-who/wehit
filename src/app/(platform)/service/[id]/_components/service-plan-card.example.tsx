import { ServicePlanCard } from "./service-plan-card";

// 사용 예시
export function ServicePlanCardExample() {
  const plans = {
    STANDARD: {
      price: 15000,
      hasVAT: true,
      title: "누끼짓 (1첫 기타)",
      description: "다음도도 활용가능한\n고화질 누끼시진.",
      features: {
        canRetouch: true,
        canPostprocess: true,
      },
      shootingTime: 30,
      imageCount: 1,
      workingDays: 7,
      revisionCount: 1,
    },
    DELUXE: {
      price: 25000,
      hasVAT: true,
      title: "누끼짓 (3첫 기타)",
      description: "고품질 누끼 작업과\n전문 보정 서비스.",
      features: {
        canRetouch: true,
        canPostprocess: true,
      },
      shootingTime: 60,
      imageCount: 3,
      workingDays: 5,
      revisionCount: 2,
    },
    PREMIUM: {
      price: 45000,
      hasVAT: true,
      title: "누끼짓 (5첫 기타)",
      description: "프리미엄 누끼 작업과\n무제한 보정 서비스.",
      features: {
        canRetouch: true,
        canPostprocess: true,
      },
      shootingTime: 120,
      imageCount: 5,
      workingDays: 3,
      revisionCount: 5,
    },
  };

  return (
    <ServicePlanCard
      plans={plans}
      onInquiry={() => {
        console.log("문의하기 클릭");
      }}
      onPurchase={(planType) => {
        console.log(`${planType} 플랜 구매하기 클릭`);
      }}
    />
  );
}
