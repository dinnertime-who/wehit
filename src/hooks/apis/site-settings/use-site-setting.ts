import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type { SiteSetting } from "@/shared/types/site-setting.type";

export const siteSettingQueryOptions = (key: string) =>
  queryOptions({
    queryKey: ["site-setting", key] as const,
    queryFn: async () => {
      return kyClient.get(`site-settings/${key}`).json<SiteSetting>();
    },
  });

export const useSiteSetting = (key: string) => {
  return useSuspenseQuery(siteSettingQueryOptions(key));
};
