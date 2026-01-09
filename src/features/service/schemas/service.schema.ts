import { z } from "zod";

export const classTypeSchema = z.enum(["group", "individual", "oneday"]);
export const durationUnitSchema = z.enum(["시간", "개월"]);

export const createServiceSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  subtitle: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  tutorInfo: z.string().min(1, "튜터 정보를 입력해주세요"),
  coverImageUrl: z.string().url("유효한 이미지 URL을 입력해주세요"),
  coverVideoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1, "설명을 입력해주세요"),
  classType: classTypeSchema.optional(),
  maxParticipants: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  durationUnit: durationUnitSchema.optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;

// Service Plan Schemas
// Key-value 형태로 자유롭게 플랜 상세 정보 관리
export const planDetailsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);

export const planTypeSchema = z.enum(["STANDARD", "DELUXE", "PREMIUM"]);

export const createServicePlanSchema = z.object({
  serviceId: z.string().min(1, "서비스 ID를 입력해주세요"),
  planType: planTypeSchema,
  price: z.number().int().positive("가격은 0보다 커야 합니다"),
  salePrice: z.number().int().positive().optional(),
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

// Service Schedule Schemas
export const scheduleTypeSchema = z.enum(["flexible", "fixed"]);

export const createServiceScheduleSchema = z.object({
  serviceId: z.string().min(1, "서비스 ID를 입력해주세요"),
  scheduleType: scheduleTypeSchema,
  scheduleDescription: z.string().optional(),
  location: z.string().min(1, "위치를 입력해주세요"),
  locationDetail: z.string().optional(),
});

export const updateServiceScheduleSchema = createServiceScheduleSchema
  .omit({ serviceId: true })
  .partial();

export type CreateServiceScheduleSchema = z.infer<typeof createServiceScheduleSchema>;
export type UpdateServiceScheduleSchema = z.infer<typeof updateServiceScheduleSchema>;
export type ScheduleTypeSchema = z.infer<typeof scheduleTypeSchema>;
