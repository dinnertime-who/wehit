import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MainHeroBanner } from "@/components/reusable/platform/main-hero-banner";
import { DisplaySections } from "@/components/reusable/platform/display-sections";
import { makeQueryClient } from "@/config/react-query/query-client";
import { bannerBySlugQueryOptions } from "@/hooks/apis/banners/use-banner-by-slug";
import { displayBySlugQueryOptions } from "@/hooks/apis/displays/use-display-by-slug";
import { MAIN_HERO_BANNER_SLUG } from "@/shared/constants/banner.constant";
import {
  RECOMMENDED_DISPLAY_SLUG,
  POPULAR_DISPLAY_SLUG,
  NEW_DISPLAY_SLUG,
} from "@/shared/constants/display.constant";

export const dynamic = "force-dynamic";

export default async function PlatformHomePage() {
  const queryClient = makeQueryClient();

  // Banner prefetch
  await queryClient.ensureQueryData(
    bannerBySlugQueryOptions(MAIN_HERO_BANNER_SLUG),
  );

  // Display prefetch
  const displaySlugs = [
    RECOMMENDED_DISPLAY_SLUG,
    POPULAR_DISPLAY_SLUG,
    NEW_DISPLAY_SLUG,
  ];

  await Promise.all(
    displaySlugs.map((slug) =>
      queryClient.ensureQueryData(displayBySlugQueryOptions(slug)),
    ),
  );

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MainHeroBanner />
        <DisplaySections />
      </HydrationBoundary>
    </div>
  );
}
