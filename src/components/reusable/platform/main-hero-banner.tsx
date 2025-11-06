"use client";

import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { MAIN_HERO_BANNER_SLUG } from "@/shared/constants/banner.constant";

export const MainHeroBanner = () => {
  const { data: banner } = useBannerBySlug(MAIN_HERO_BANNER_SLUG);

  return <div>{banner?.slug ?? "No banner"}</div>;
};
