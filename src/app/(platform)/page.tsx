import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategorySection } from "@/components/reusable/platform/category-section";
import { ClassPreviewSection } from "@/components/reusable/platform/class-preview-section";
import { DisplaySection } from "@/components/reusable/platform/display-sections";
import { ExampleInfluencers } from "@/components/reusable/platform/example-influencers";
import { ExpertSection } from "@/components/reusable/platform/expert-section";
import { MainHeroBanner } from "@/components/reusable/platform/main-hero-banner";
import { ReviewSection } from "@/components/reusable/platform/review-section";
import { SnsServices } from "@/components/reusable/platform/sns-services";
import { TextSection } from "@/components/reusable/platform/text-section";
import { makeQueryClient } from "@/config/react-query/query-client";
import { bannerBySlugQueryOptions } from "@/hooks/apis/banners/use-banner-by-slug";
import { displayBySlugQueryOptions } from "@/hooks/apis/displays/use-display-by-slug";
import { tryCatch } from "@/lib/try-catch";
import {
  MAIN_HERO_BANNER_SLUG,
  MIDDLE_BANNER_SLUG,
  WEEKLY_TREND_BANNER_SLUG,
} from "@/shared/constants/banner.constant";
import {
  FEATURED_DISPLAY_SLUG,
  NEW_DISPLAY_SLUG,
  POPULAR_DISPLAY_SLUG,
  RECOMMENDED_DISPLAY_SLUG,
  TRENDING_DISPLAY_SLUG,
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
    tryCatch(async () => {
      return await queryClient.ensureQueryData(
        bannerBySlugQueryOptions(WEEKLY_TREND_BANNER_SLUG),
      );
    }),
  ]);

  // Display prefetch
  const displaySlugs = [
    RECOMMENDED_DISPLAY_SLUG,
    POPULAR_DISPLAY_SLUG,
    NEW_DISPLAY_SLUG,
    TRENDING_DISPLAY_SLUG,
    FEATURED_DISPLAY_SLUG,
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

        <CategorySection />

        <DisplaySection
          slug={RECOMMENDED_DISPLAY_SLUG}
          className="pt-0 lg:pt-0"
        />

        <DisplaySection slug={POPULAR_DISPLAY_SLUG} className="pt-0 lg:pt-0" />

        <ClassPreviewSection />

        <div>
          <TextSection
            title={[
              "인스타그램 & 블로그 & 유튜브까지!",
              "나만의 SNS 채널로 팔로워와 수익을 동시에 키워보세요",
            ]}
          />
          <ExampleInfluencers />
        </div>

        <ExpertSection />

        <SnsServices />

        <ReviewSection />
      </HydrationBoundary>
    </div>
  );
}
