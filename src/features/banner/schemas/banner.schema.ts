import { z } from "zod";

export const displayDeviceSchema = z.enum(["mobile", "desktop", "all"]);

export const createBannerSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  widthRatio: z.number().positive("Width ratio must be positive"),
  heightRatio: z.number().positive("Height ratio must be positive"),
  displayDevice: displayDeviceSchema,
});

export const updateBannerSchema = createBannerSchema.partial();

export const createBannerItemSchema = z.object({
  bannerId: z.string().min(1, "Banner ID is required"),
  imageUrl: z.url("Invalid image URL"),
  videoUrl: z.url("Invalid video URL").optional().nullable(),
  linkUrl: z.string("Invalid link URL"),
  order: z.number().int().nonnegative("Order must be non-negative"),
  viewStartDate: z.date().nullable().optional(),
  viewEndDate: z.date().nullable().optional(),
});

export const updateBannerItemSchema = createBannerItemSchema.partial();

export type CreateBannerDTO = z.infer<typeof createBannerSchema>;
export type UpdateBannerDTO = z.infer<typeof updateBannerSchema>;
export type CreateBannerItemDTO = z.infer<typeof createBannerItemSchema>;
export type UpdateBannerItemDTO = z.infer<typeof updateBannerItemSchema>;
