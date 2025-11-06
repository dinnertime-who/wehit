"use client";

import { useState } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { MAIN_HERO_BANNER_SLUG } from "@/shared/constants/banner.constant";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

export const MainHeroBanner = () => {
  const { data: banner } = useBannerBySlug(MAIN_HERO_BANNER_SLUG);
  const [currentIndex, setCurrentIndex] = useState(1);

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={800}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop
        className="w-full"
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
      >
        {banner?.items.map((item) => (
          <SwiperSlide
            key={item.id}
            className="w-full h-full"
            style={{
              minHeight: `${banner.heightRatio}px`,
            }}
          >
            <Image
              src={item.imageUrl}
              alt={item.imageUrl}
              width={banner.widthRatio}
              height={banner.heightRatio}
              className="w-full h-full object-cover object-center"
              style={{
                minHeight: `${banner.heightRatio}px`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute z-10 bottom-4 right-1/2 translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm font-medium">
        {currentIndex} / {banner?.items.length || 0}
      </div>
    </div>
  );
};
