export type Review = {
  id: string;
  serviceId: string;
  userId: string | null;
  writerName: string;
  rating: number; // 1-5
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateReviewDTO = {
  serviceId: string;
  userId?: string;
  writerName: string;
  rating: number;
  content: string;
};

export type UpdateReviewDTO = Partial<Omit<CreateReviewDTO, "serviceId">>;
