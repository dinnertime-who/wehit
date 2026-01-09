export type Review = {
  id: string;
  serviceId: string;
  userId: string | null;
  writerName: string;
  rating: number; // 1-5
  content: string;
  isBest: boolean; // 베스트 리뷰 여부
  createdAt: Date;
  updatedAt: Date;
};

export type CreateReviewDTO = {
  serviceId: string;
  userId?: string;
  writerName: string;
  rating: number;
  content: string;
  isBest?: boolean;
};

export type UpdateReviewDTO = Partial<Omit<CreateReviewDTO, "serviceId">>;
