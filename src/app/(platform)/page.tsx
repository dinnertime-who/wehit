import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DisplaySections } from "@/components/reusable/platform/display-sections";
import { LandingSections } from "@/components/reusable/platform/landing-sections";
import { MainHeroBanner } from "@/components/reusable/platform/main-hero-banner";
import { MiddleBanner } from "@/components/reusable/platform/middle-banner";
import { makeQueryClient } from "@/config/react-query/query-client";
import { bannerBySlugQueryOptions } from "@/hooks/apis/banners/use-banner-by-slug";
import { displayBySlugQueryOptions } from "@/hooks/apis/displays/use-display-by-slug";
import { tryCatch } from "@/lib/try-catch";
import {
  MAIN_HERO_BANNER_SLUG,
  MIDDLE_BANNER_SLUG,
} from "@/shared/constants/banner.constant";
import {
  NEW_DISPLAY_SLUG,
  POPULAR_DISPLAY_SLUG,
  RECOMMENDED_DISPLAY_SLUG,
} from "@/shared/constants/display.constant";

export const dynamic = "force-dynamic";

export default async function PlatformHomePage() {
  const queryClient = makeQueryClient();

  // Banner prefetch
  await Promise.all([
    tryCatch(async () => {
      return await queryClient.ensureQueryData(
        bannerBySlugQueryOptions(MAIN_HERO_BANNER_SLUG),
      );
    }),
    tryCatch(async () => {
      return await queryClient.ensureQueryData(
        bannerBySlugQueryOptions(MIDDLE_BANNER_SLUG),
      );
    }),
  ]);

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
        <LandingSections />
      </HydrationBoundary>
    </div>
  );
}
