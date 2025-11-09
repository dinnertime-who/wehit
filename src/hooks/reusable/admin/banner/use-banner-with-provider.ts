import { useBannerId } from "@/components/reusable/admin/banners/detail/banner-id-provider";
import { useBanner } from "@/hooks/apis/banners/use-banner";

export const useBannerWithProvider = () => {
  const id = useBannerId();
  return useBanner(id);
};
