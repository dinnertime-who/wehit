import type { ServiceWithReviewStats } from "@/shared/types/display.type";

export type ClassListItem = {
  id: string;
  title: string;
  tutor: string;
  discountRate: number;
  originalPrice: number;
  salePrice: number;
  reviewCount: number;
  thumbnail: string;
  rating: number;
};

/**
 * ServiceWithReviewStats를 ClassListSection에서 사용하는 형식으로 변환
 */
export function convertServiceToClassItem(
  service: ServiceWithReviewStats,
): ClassListItem {
  const originalPrice = service.price;
  const salePrice = service.salePrice ?? service.price;
  const discountRate =
    service.salePrice && service.salePrice < service.price
      ? Math.round(((service.price - service.salePrice) / service.price) * 100)
      : 0;

  // tutorInfo에서 튜터 이름 추출 (예: "김철수 | 10년차..." -> "김철수")
  const tutor = service.tutorInfo.split("|")[0]?.trim() || service.tutorInfo;

  return {
    id: service.id,
    title: service.title,
    tutor,
    discountRate,
    originalPrice,
    salePrice,
    reviewCount: service.reviewCount,
    thumbnail: service.coverImageUrl,
    rating: service.rating,
  };
}

