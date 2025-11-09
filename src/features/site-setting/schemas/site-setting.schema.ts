import { z } from "zod";

export const createSiteSettingSchema = z.object({
  key: z.string().min(1, "설정 키를 입력해주세요"),
  value: z.string().min(1, "설정 값을 입력해주세요"),
  description: z.string().optional(),
});

export const updateSiteSettingSchema = z.object({
  value: z.string().min(1, "설정 값을 입력해주세요"),
  description: z.string().optional(),
});

export type CreateSiteSettingSchema = z.infer<typeof createSiteSettingSchema>;
export type UpdateSiteSettingSchema = z.infer<typeof updateSiteSettingSchema>;
