"use client";

import type Link from "next/link";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { VideoPlayControlProvider } from "@/hooks/reusable/platform/video-play-control";
import { WEEKLY_TREND_BANNER_SLUG } from "@/shared/constants/banner.constant";
import { ClassPreviewCard } from "./class-preview-card";

export function ClassPreviewSection() {
  const { data: banner } = useBannerBySlug(WEEKLY_TREND_BANNER_SLUG);

  if (!banner || !banner.items || banner.items.length === 0) {
    return null;
  }

  return (
    <section className="py-6 lg:py-12">
      <div className="app-container px-4">
        <div className="mb-5">
          <h2 className="text-heading-3">{banner.name}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <VideoPlayControlProvider>
            {banner.items.map((item) => (
              <ClassPreviewCard
                key={item.id}
                id={item.id}
                href={
                  (item.linkUrl || "/") as React.ComponentProps<
                    typeof Link
                  >["href"]
                }
                title="트렌디 클래스"
                tutor="트렌디"
                thumbnailUrl={item.imageUrl}
                videoUrl={item.videoUrl || ""}
              />
            ))}
          </VideoPlayControlProvider>
        </div>
      </div>
    </section>
  );
}
