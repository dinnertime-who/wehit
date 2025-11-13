import { z } from "zod";

export const createDisplaySchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  slug: z.string().min(1, "슬러그는 필수입니다").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "슬러그는 소문자, 숫자, 하이픈만 포함 가능합니다"),
});

export const updateDisplaySchema = createDisplaySchema.partial();

export const addServiceToDisplaySchema = z.object({
  displayId: z.string().min(1, "디스플레이 ID는 필수입니다"),
  serviceId: z.string().min(1, "서비스 ID는 필수입니다"),
  order: z.number().int().nonnegative("순서는 음수가 될 수 없습니다"),
});

export const reorderDisplayServicesSchema = z.object({
  displayId: z.string().min(1, "디스플레이 ID는 필수입니다"),
  items: z.array(
    z.object({
      serviceId: z.string().min(1, "서비스 ID는 필수입니다"),
      order: z.number().int().nonnegative("순서는 음수가 될 수 없습니다"),
    }),
  ).min(1, "최소 하나의 항목이 필요합니다"),
});

export type CreateDisplayDTO = z.infer<typeof createDisplaySchema>;
export type UpdateDisplayDTO = z.infer<typeof updateDisplaySchema>;
export type AddServiceToDisplayDTO = z.infer<typeof addServiceToDisplaySchema>;
export type ReorderDisplayServicesDTO = z.infer<typeof reorderDisplayServicesSchema>;
