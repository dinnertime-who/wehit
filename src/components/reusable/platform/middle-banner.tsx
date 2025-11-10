"use client";

import { useState } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { MIDDLE_BANNER_SLUG } from "@/shared/constants/banner.constant";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

export const MiddleBanner = () => {
  const { data: banner } = useBannerBySlug(MIDDLE_BANNER_SLUG);
  const [currentIndex, setCurrentIndex] = useState(1);

  if (!banner || !banner.items || banner.items.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full py-12">
      <div className="app-container">
        <div className="relative w-full" style={{ aspectRatio: "1200/400" }}>
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
            className="w-full h-full rounded-lg overflow-hidden"
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
          >
            {banner.items.map((item) => (
              <SwiperSlide key={item.id} className="w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.imageUrl}
                  width={1200}
                  height={400}
                  className="w-full h-full object-cover object-center"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {banner.items.length > 1 && (
            <div className="absolute z-10 bottom-4 right-1/2 translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm font-medium">
              {currentIndex} / {banner.items.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

