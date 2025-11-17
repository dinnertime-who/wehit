"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./example-influencers.style.css";
import { Autoplay } from "swiper/modules";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { EXAMPLE_INFLUENCERS_BANNER_SLUG } from "@/shared/constants/banner.constant";

function ensureMinimumItems<T>(items: T[], minCount: number): T[] {
  if (items.length === 0) return [];
  if (items.length >= minCount) return items;
  return ensureMinimumItems([...items, ...items], minCount);
}

export function ExampleInfluencers() {
  const { data: banner } = useBannerBySlug(EXAMPLE_INFLUENCERS_BANNER_SLUG);
  if (!banner || !banner.items || banner.items.length === 0) {
    return null;
  }

  // 최소 16개의 아이템이 보장되도록 재귀적으로 배열을 복제합니다.

  const exampleInfluencers = ensureMinimumItems(
    banner.items.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      name: item.name,
    })),
    16,
  );

  return (
    <section className="mt-24 py-4">
      <div className="space-y-10">
        <div className="py-4">
          <Swiper
            speed={10000}
            loop={true}
            modules={[Autoplay]}
            centeredSlides={true}
            slidesPerView={"auto"}
            freeMode={true}
            spaceBetween={20}
            allowTouchMove={false}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
            }}
          >
            {exampleInfluencers.map((influencer, index) => (
              <SwiperSlide
                key={`${influencer.id}-${index}`}
                style={{ width: "max-content" }}
              >
                <Image
                  src={influencer.imageUrl}
                  alt={influencer.name || "Example Influencer"}
                  width={230}
                  height={300}
                  unoptimized
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="py-4 ">
          <Swiper
            speed={10000}
            loop={true}
            modules={[Autoplay]}
            centeredSlides={true}
            slidesPerView={"auto"}
            freeMode={true}
            spaceBetween={20}
            allowTouchMove={false}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
          >
            {exampleInfluencers.map((influencer, index) => (
              <SwiperSlide
                key={`reverse-${influencer.id}-${index}`}
                style={{ width: "max-content" }}
              >
                <Image
                  src={influencer.imageUrl}
                  alt={influencer.name || "Example Influencer"}
                  width={230}
                  height={300}
                  unoptimized
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
