"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { MIDDLE_BANNER_SLUG } from "@/shared/constants/banner.constant";
import "swiper/css";

export function MainMiddleBanner() {
  const { data: banner } = useBannerBySlug(MIDDLE_BANNER_SLUG);

  if (!banner || !banner.items || banner.items.length === 0) {
    return null;
  }

  return (
    <section className="py-6 lg:py-12">
      <div className="app-container px-4">
        <Swiper
          modules={[Autoplay]}
          speed={500}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          className="rounded-xl overflow-hidden"
        >
          {banner.items.map((item) => (
            <SwiperSlide key={item.id} className="">
              <Link
                href={
                  (item.linkUrl || "/") as React.ComponentProps<
                    typeof Link
                  >["href"]
                }
              >
                <Image
                  src={item.imageUrl}
                  alt="Middle Banner"
                  width={banner.widthRatio}
                  height={banner.heightRatio}
                  className="w-full h-full object-cover object-center"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
