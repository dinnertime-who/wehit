import { db } from "@/infrastructure/db/drizzle";
import { review, service } from "@/infrastructure/db/schema";

// 각 서비스당 3-4개의 리뷰 데이터
const reviewsTemplate = [
  {
    writerName: "김민지",
    rating: 5,
    content:
      "정말 알찬 강의였습니다! 설명이 너무 쉽고 자세해서 초보자인 저도 쉽게 따라갈 수 있었어요. 강사님의 열정이 느껴지는 강의입니다. 적극 추천합니다!",
  },
  {
    writerName: "이준호",
    rating: 4,
    content:
      "전반적으로 좋은 강의입니다. 내용도 알차고 실습 예제도 많아서 도움이 많이 됐어요. 다만 중급 내용이 조금 더 있었으면 하는 아쉬움이 있네요.",
  },
  {
    writerName: "박서연",
    rating: 5,
    content:
      "이 강의 덕분에 실무에 바로 적용할 수 있는 실력을 갖추게 되었습니다. 강사님의 실무 경험이 묻어나는 팁들이 특히 유용했어요. 감사합니다!",
  },
  {
    writerName: "최우진",
    rating: 4,
    content:
      "체계적인 커리큘럼과 친절한 설명이 인상적이었습니다. 기초부터 차근차근 배울 수 있어서 좋았어요. 질문에 대한 피드백도 빨라서 만족스러웠습니다.",
  },
  {
    writerName: "정예은",
    rating: 5,
    content:
      "최고의 강의입니다! 이론과 실습의 밸런스가 완벽하고, 강사님의 설명이 정말 명쾌해요. 포트폴리오로 만들 수 있는 프로젝트도 포함되어 있어서 더욱 좋았습니다.",
  },
  {
    writerName: "강태양",
    rating: 5,
    content:
      "비전공자인 제가 들어도 이해하기 쉽게 설명해주셔서 감사합니다. 어려운 개념도 예시를 들어가며 설명해주셔서 금방 이해할 수 있었어요!",
  },
  {
    writerName: "윤지우",
    rating: 4,
    content:
      "좋은 강의 감사합니다. 실무 경험이 풍부하신 강사님의 노하우를 배울 수 있어서 유익했습니다. 더 많은 심화 내용도 기대하고 있겠습니다.",
  },
  {
    writerName: "송하늘",
    rating: 5,
    content:
      "강의 퀄리티가 정말 높습니다. 한 강의, 한 강의 정성이 가득해요. 실습 자료도 잘 준비되어 있고, 강사님의 피드백도 세심하셔서 많이 배웠습니다.",
  },
  {
    writerName: "임바다",
    rating: 4,
    content:
      "기대 이상이었습니다! 내용이 알차고 진행 속도도 적절해서 부담 없이 들을 수 있었어요. 실전에서 활용할 수 있는 팁들이 많아서 좋았습니다.",
  },
  {
    writerName: "한별이",
    rating: 5,
    content:
      "이 가격에 이런 퀄리티라니 정말 만족스럽습니다. 초보자 입장에서 가장 이해하기 쉬운 강의였어요. 다른 강의도 꼭 들어보고 싶습니다!",
  },
  {
    writerName: "조은별",
    rating: 3,
    content:
      "전반적으로 괜찮은 강의입니다. 다만 제 수준에는 조금 쉬운 감이 있었어요. 입문자에게는 정말 좋을 것 같습니다.",
  },
  {
    writerName: "배슬기",
    rating: 5,
    content:
      "강사님의 열정과 전문성이 느껴지는 훌륭한 강의였습니다. 수강 후 실제로 프로젝트를 진행할 수 있을 정도로 실력이 향상되었어요. 강력 추천!",
  },
  {
    writerName: "서진호",
    rating: 4,
    content:
      "실무에 필요한 내용들이 잘 정리되어 있습니다. 강의 자료도 깔끔하고 예제가 다양해서 좋았어요. 복습할 때도 유용하게 활용하고 있습니다.",
  },
  {
    writerName: "안지수",
    rating: 5,
    content:
      "완전 초보였는데 이 강의 하나로 자신감이 생겼습니다! 강사님이 정말 친절하게 설명해주셔서 어렵지 않게 배울 수 있었어요. 적극 추천합니다!",
  },
];

export async function seedReview() {
  try {
    console.log("🌱 Seeding review data...");

    // 1. Get all services
    const services = await db.select().from(service);

    if (services.length === 0) {
      console.log("⚠️ No services found. Please run seedService first.");
      return [];
    }

    // 2. Delete existing reviews
    await db.delete(review);
    console.log("✓ Cleared existing review data");

    // 3. Create reviews for each service (3-4 reviews per service)
    const reviewsToInsert = [];
    let reviewIndex = 0;

    for (const svc of services) {
      // 각 서비스당 3-4개의 리뷰를 랜덤하게 생성
      const reviewCount = 3 + Math.floor(Math.random() * 2); // 3 or 4
      
      // 베스트 리뷰 개수 결정 (0-2개)
      const bestReviewCount = Math.floor(Math.random() * 3); // 0, 1, or 2
      const bestReviewIndices = new Set<number>();
      
      // 베스트 리뷰 인덱스를 랜덤하게 선택
      while (bestReviewIndices.size < Math.min(bestReviewCount, reviewCount)) {
        bestReviewIndices.add(Math.floor(Math.random() * reviewCount));
      }

      for (let i = 0; i < reviewCount; i++) {
        const reviewTemplate =
          reviewsTemplate[reviewIndex % reviewsTemplate.length];
        reviewsToInsert.push({
          serviceId: svc.id,
          writerName: reviewTemplate.writerName,
          rating: reviewTemplate.rating,
          content: reviewTemplate.content,
          isBest: bestReviewIndices.has(i), // 랜덤으로 베스트 리뷰 설정
        });
        reviewIndex++;
      }
    }

    const createdReviews = await db
      .insert(review)
      .values(reviewsToInsert)
      .returning();

    console.log(`✓ Created ${createdReviews.length} reviews for ${services.length} services`);
    console.log("✅ Review seed completed successfully");

    return createdReviews;
  } catch (error) {
    console.error("❌ Error seeding review data:", error);
    throw error;
  }
}

