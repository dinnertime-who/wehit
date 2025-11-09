import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  subtitle: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  tutorInfo: z.string().min(1, "튜터 정보를 입력해주세요"),
  coverImageUrl: z.string().url("유효한 이미지 URL을 입력해주세요"),
  coverVideoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1, "설명을 입력해주세요"),
  price: z.number().int().positive("가격은 0보다 커야 합니다"),
  salePrice: z.number().int().positive().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
