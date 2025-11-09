export type SiteSetting = {
  key: string;
  value: string;
  description: string | null;
  updatedAt: Date;
};

export type CreateSiteSettingDTO = {
  key: string;
  value: string;
  description?: string;
};

export type UpdateSiteSettingDTO = Partial<Omit<CreateSiteSettingDTO, "key">>;
