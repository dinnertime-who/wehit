"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import {
  MOBILE_MOCK_BANNER_SLUG,
  SNS_BANNER_SLUG,
} from "@/shared/constants/banner.constant";

export function SnsServices() {
  const { data: banner } = useBannerBySlug(SNS_BANNER_SLUG);
  const { data: mobileMock } = useBannerBySlug(MOBILE_MOCK_BANNER_SLUG);
  if (
    !banner ||
    !banner.items ||
    banner.items.length === 0 ||
    !mobileMock ||
    !mobileMock.items ||
    mobileMock.items.length === 0
  ) {
    return null;
  }

  const snsItems = banner.items.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    name: item.name,
  }));

  return (
    <section className="app-container py-20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* 왼쪽 섹션 */}
        <div className="flex-1 space-y-6 max-w-md break-keep">
          <div className="text-lime-600 text-lg font-semibold uppercase tracking-wider">
            SERVICE
          </div>

          <h2 className="text-[40px] font-semibold leading-tight">
            다양한 마케팅 서비스를 통해 SNS가 만드는 대표님의 경쟁력을
            느껴보세요.
          </h2>

          <p className="text-xl leading-relaxed">
            인스타그램은 물론 페이스북, 유튜브, 네이버 등 모든 SNS와 다양한
            웹사이트를 셀프로 관리가 가능합니다.
          </p>

          {/* 소셜 미디어 아이콘들 */}
          <div className="flex items-center gap-4 pt-8">
            {snsItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, translateY: 100 }}
                whileInView={{ opacity: [0, 1], translateY: [84, 0] }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.65,
                  delay: (index + 1) * 0.25,
                }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name || "SNS"}
                  width={84}
                  height={84}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* 오른쪽 섹션 - 스마트폰 목업 */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end"
          initial={{ opacity: 0, translateY: 100 }}
          whileInView={{ opacity: [0, 1], translateY: [84, 0] }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
          }}
        >
          <Image
            src={mobileMock.items[0].imageUrl}
            alt="SNS Services"
            width={362}
            height={849}
          />
        </motion.div>
      </div>
    </section>
  );
}
