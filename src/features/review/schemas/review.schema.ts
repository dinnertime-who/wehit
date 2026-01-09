import { z } from "zod";

export const createReviewSchema = z.object({
  serviceId: z.string().min(1, "서비스 ID는 필수입니다"),
  userId: z.string().optional(),
  writerName: z.string().min(1, "작성자 이름을 입력해주세요"),
  rating: z
    .number()
    .int()
    .min(1, "평점은 1 이상이어야 합니다")
    .max(5, "평점은 5 이하여야 합니다"),
  content: z.string().min(1, "리뷰 내용을 입력해주세요"),
  isBest: z.boolean().default(false),
});

export const updateReviewSchema = createReviewSchema
  .partial()
  .omit({ serviceId: true });

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>;
