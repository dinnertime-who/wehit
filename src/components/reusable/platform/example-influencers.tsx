"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./example-influencers.style.css";
import { Autoplay } from "swiper/modules";

const influencers = [
  {
    id: 1,
    name: "John Doe",
    image: "/img1.png",
  },
  {
    id: 2,
    name: "Jane Doe",
    image: "/img2.png",
  },
];

export function ExampleInfluencers() {
  // 메모리 최적화: 복제 횟수를 9번에서 4번으로 줄임
  const duplicatedInfluencers = Array(8).fill(influencers).flat();

  return (
    <section className="mt-28 py-4">
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
            {duplicatedInfluencers.map((influencer, index) => (
              <SwiperSlide
                key={`${influencer.id}-${index}`}
                style={{ width: "max-content" }}
              >
                <Image
                  src={influencer.image}
                  alt={influencer.name}
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
            {duplicatedInfluencers.map((influencer, index) => (
              <SwiperSlide
                key={`reverse-${influencer.id}-${index}`}
                style={{ width: "max-content" }}
              >
                <Image
                  src={influencer.image}
                  alt={influencer.name}
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
