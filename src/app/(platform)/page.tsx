import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MainHeroBanner } from "@/components/reusable/platform/main-hero-banner";
import { makeQueryClient } from "@/config/react-query/query-client";
import { bannerBySlugQueryOptions } from "@/hooks/apis/banners/use-banner-by-slug";
import { MAIN_HERO_BANNER_SLUG } from "@/shared/constants/banner.constant";

export default async function PlatformHomePage() {
  const queryClient = makeQueryClient();

  await queryClient.ensureQueryData(
    bannerBySlugQueryOptions(MAIN_HERO_BANNER_SLUG),
  );

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MainHeroBanner />
      </HydrationBoundary>
    </div>
  );
}
