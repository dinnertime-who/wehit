import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  subtitle: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  tutorInfo: z.string().min(1, "튜터 정보를 입력해주세요"),
  coverImageUrl: z.string().url("유효한 이미지 URL을 입력해주세요"),
  coverVideoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1, "설명을 입력해주세요"),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;

// Service Plan Schemas
export const planDetailsSchema = z.object({
  features: z.object({
    canRetouch: z.boolean(),
    canPostprocess: z.boolean(),
  }),
  shootingTime: z.number().int().positive("촬영 시간은 0보다 커야 합니다"),
  imageCount: z.number().int().positive("이미지 수는 0보다 커야 합니다"),
  workingDays: z.number().int().positive("작업일은 0보다 커야 합니다"),
  revisionCount: z.number().int().nonnegative("수정 횟수는 0 이상이어야 합니다"),
});

export const planTypeSchema = z.enum(["STANDARD", "DELUXE", "PREMIUM"]);

export const createServicePlanSchema = z.object({
  serviceId: z.string().min(1, "서비스 ID를 입력해주세요"),
  planType: planTypeSchema,
  price: z.number().int().positive("가격은 0보다 커야 합니다"),
  title: z.string().optional(),
  description: z.string().optional(),
  hasVAT: z.boolean().default(true),
  details: planDetailsSchema,
});

export const updateServicePlanSchema = createServicePlanSchema
  .omit({ serviceId: true, planType: true })
  .partial();

export type CreateServicePlanSchema = z.infer<typeof createServicePlanSchema>;
export type UpdateServicePlanSchema = z.infer<typeof updateServicePlanSchema>;
export type PlanDetailsSchema = z.infer<typeof planDetailsSchema>;
export type PlanTypeSchema = z.infer<typeof planTypeSchema>;
