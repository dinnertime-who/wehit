import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kyClient } from "@/lib/fetch/client";
import type {
  SiteSetting,
  UpdateSiteSettingDTO,
} from "@/shared/types/site-setting.type";

export const useUpdateSiteSetting = (key: string) => {
  const queryClient = useQueryClient();

  return useMutation<SiteSetting, Error, UpdateSiteSettingDTO>({
    mutationFn: async (data) => {
      return kyClient
        .put(`site-settings/${key}`, { json: data })
        .json<SiteSetting>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-setting", key] });
    },
  });
};
