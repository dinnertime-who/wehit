"use client";

import { BannerItemList } from "./banner-item-list";
import { useBannerWithProvider } from "@/hooks/reusable/admin/banner/use-banner-with-provider";
import { useBannerId } from "./banner-id-provider";

export const BannerItemsSection = () => {
  const bannerId = useBannerId();
  const { data: banner } = useBannerWithProvider();

  return (
    <div className="mt-8">
      <BannerItemList bannerId={bannerId} banner={banner} />
    </div>
  );
};
