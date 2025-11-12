"use client";

import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type Review = {
  id: string;
  userName: string;
  service: string;
  rating: number;
  avatarUrl: string;
  content: string;
};

const reviews: Review[] = [
  {
    id: "1",
    userName: "lulu**",
    service: "유튜브조회수늘리기",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "정말 만족스러운 서비스였습니다. 조회수가 눈에 띄게 늘어났고, 영상 품질도 좋아졌어요. 추천합니다!",
  },
  {
    id: "2",
    userName: "hisn**",
    service: "인스타그램좋아요늘리기",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "인스타그램 좋아요가 빠르게 늘어나서 놀랐어요. 서비스 품질도 좋고 고객 응대도 친절합니다.",
  },
  {
    id: "3",
    userName: "seoy**",
    service: "유튜브구독자구매",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "구독자 수가 크게 증가했어요. 자연스럽게 늘어나서 만족합니다. 다음에도 이용할 예정입니다.",
  },
  {
    id: "4",
    userName: "revi**",
    service: "한국인 좋아요 늘리기",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "한국인 좋아요가 정확하게 늘어났어요. 서비스 신뢰도가 높고 결과도 만족스럽습니다.",
  },
  {
    id: "5",
    userName: "tevi**",
    service: "인스타팔로워구매",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "팔로워가 자연스럽게 늘어났고, 계정 활동도 활발해졌어요. 정말 좋은 서비스입니다!",
  },
  {
    id: "6",
    userName: "yoon**",
    service: "인스타팔로워구매",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "팔로워가 자연스럽게 늘어났고, 계정 활동도 활발해졌어요. 정말 좋은 서비스입니다!",
  },
  {
    id: "7",
    userName: "yoon**",
    service: "인스타팔로워구매",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "팔로워가 자연스럽게 늘어났고, 계정 활동도 활발해졌어요. 정말 좋은 서비스입니다!",
  },
  {
    id: "8",
    userName: "yoon**",
    service: "인스타팔로워구매",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "팔로워가 자연스럽게 늘어났고, 계정 활동도 활발해졌어요. 정말 좋은 서비스입니다!",
  },
  {
    id: "9",
    userName: "yoon**",
    service: "인스타팔로워구매",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "팔로워가 자연스럽게 늘어났고, 계정 활동도 활발해졌어요. 정말 좋은 서비스입니다!",
  },
  {
    id: "10",
    userName: "yoon**",
    service: "인스타팔로워구매",
    rating: 5,
    avatarUrl: "/model-1.png",
    content:
      "팔로워가 자연스럽게 늘어났고, 계정 활동도 활발해졌어요. 정말 좋은 서비스입니다!",
  },
];

export const ReviewSection = () => {
  return (
    <section className="relative bg-gray-800 py-20">
      <div className="">
        {/* 헤더 */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl leading-normal font-semibold text-white text-center mb-12">
          WIHIT는 지금 이 순간도 <br /> 많은 브랜드와 함께 성장하고 있습니다.
        </h2>

        {/* Swiper 리뷰 카드들 */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: [0, 1], y: [100, 0] }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
          }}
        >
          <Swiper
            spaceBetween={24}
            slidesPerView={"auto"}
            className="pb-12"
            loop={true}
            centeredSlides={true}
          >
            {reviews.map((review) => (
              <SwiperSlide
                key={review.id}
                className="max-w-[320px] aspect-320/360"
              >
                <div className="bg-white rounded-[28px] rounded-br-[62px] p-6 shadow-lg h-full flex flex-col ">
                  {/* 사용자 정보 및 아바타 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">
                        {review.userName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {review.service}
                      </p>
                      {/* 별점 */}
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((starNum) => (
                            <Star
                              key={starNum}
                              className={`w-4 h-4 ${
                                starNum <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    {/* 아바타 */}
                    <div className="ml-4 shrink-0">
                      <div className="bg-gray-200 rounded-full flex items-center justify-center p-4">
                        <User className="size-8 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* 리뷰 내용 */}
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {review.content}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};
