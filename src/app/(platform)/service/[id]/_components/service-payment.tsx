"use client";

import {
  CalendarCheck,
  MessageCircleQuestion,
  PlayCircle,
  Share2,
  Star,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScheduleCard } from "./schedule-card";

type VodInfo = {
  totalLessons: number;
  totalDuration: string;
  hasQnA: boolean;
  isLifetimeAccess: boolean;
};

type Schedule = {
  id: string;
  scheduleType: "flexible" | "fixed";
  scheduleDescription?: string;
  location: string;
  locationDetail?: string;
};

type Props = {
  title: string;
  reviewRating: number;
  reviewCount: number;
  originalPrice: number;
  salePrice?: number;
  totalAmount: number;
  vodInfo: VodInfo;
  schedules?: Schedule[];
};

export function ServicePayment(props: Props) {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    props.schedules && props.schedules.length > 0
      ? props.schedules[0].id
      : null,
  );

  const discountPercent = props.salePrice
    ? Math.round(
        ((props.originalPrice - props.salePrice) / props.originalPrice) * 100,
      )
    : 0;

  return (
    <div
      id="vod-widget"
      className="h-fit w-full rounded-lg pt-6 md:sticky md:top-[100px] md:min-w-[384px] md:border md:border-line-normal md:p-6"
    >
      {/* 타이틀 */}
      <section>
        <h1 className="whitespace-pre-wrap text-2xl font-bold text-gray-900">
          {props.title}
        </h1>
      </section>

      {/* 별점 */}
      <div className="mt-3">
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const starIndex = i + 1;
              const rating = props.reviewRating;

              // 완전히 채워진 별
              if (rating >= starIndex) {
                return (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                );
              }

              // 반 별 (0.5 단위)
              if (rating >= starIndex - 0.5) {
                return (
                  <div key={i} className="relative h-5 w-5">
                    <Star className="absolute h-5 w-5 text-gray-200" />
                    <div
                      className="absolute overflow-hidden"
                      style={{ width: "50%" }}
                    >
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                );
              }

              // 빈 별
              return <Star key={i} className="h-5 w-5 text-gray-200" />;
            })}
          </div>
          <span className="ml-1 text-base font-medium text-gray-900">
            {props.reviewRating.toFixed(1)}
          </span>
          <span className="cursor-pointer text-base font-medium text-taling-pink-600">
            ({props.reviewCount})
          </span>
        </div>
      </div>

      {/* 가격 정보 */}
      <div className="mt-5">
        {props.salePrice ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-taling-pink-600">
                {discountPercent}%
              </span>
              <span className="text-base text-gray-400 line-through">
                {props.originalPrice.toLocaleString()}원
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-gray-900">
              <span className="text-taling-pink-600">신규 할인가</span>{" "}
              {props.salePrice.toLocaleString()}원
            </p>
          </div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">
            {props.originalPrice.toLocaleString()}원
          </p>
        )}
      </div>

      {/* 구분선 */}
      <div className="my-5 border-t border-gray-200" />

      {/* VOD 정보 */}
      <div className="flex flex-col gap-4 text-taling-gray-500 font-medium">
        <div className="flex items-center gap-3">
          <PlayCircle className="h-6 w-6 stroke-[1.5]" />
          <span className="text-base">
            총 {props.vodInfo.totalLessons}강 · {props.vodInfo.totalDuration}
          </span>
        </div>
        {props.vodInfo.hasQnA && (
          <div className="flex items-center gap-3">
            <MessageCircleQuestion className="h-6 w-6 stroke-[1.5]" />
            <span className="text-base">Q&A 가능</span>
          </div>
        )}
        {props.vodInfo.isLifetimeAccess && (
          <div className="flex items-center gap-3">
            <CalendarCheck className="h-6 w-6 stroke-[1.5]" />
            <span className="text-base">평생 수강 가능</span>
          </div>
        )}
      </div>

      {/* 일정 선택 (optional) */}
      {props.schedules && props.schedules.length > 0 && (
        <div className="mt-6">
          <h2 className="pb-2 text-lg font-semibold">일정 선택</h2>
          <div className="flex max-h-[320px] gap-2 overflow-y-auto md:flex-col">
            {props.schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                scheduleType={schedule.scheduleType}
                scheduleDescription={schedule.scheduleDescription}
                location={schedule.location}
                locationDetail={schedule.locationDetail}
                isSelected={selectedScheduleId === schedule.id}
                onClick={() => setSelectedScheduleId(schedule.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 총 결제 금액 */}
      <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-100 px-4 py-4">
        <span className="text-base font-semibold text-gray-500">
          총 결제 금액
        </span>
        <span className="text-xl font-bold text-taling-pink-600">
          {props.totalAmount.toLocaleString()}원
        </span>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 z-navigation w-full bg-white bg-opacity-80 px-4 py-2 backdrop-blur-md md:static md:mt-4 md:p-0">
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <a className="flex-1" href="#service-plan">
            <div
              className={cn(
                "flex h-12 items-center justify-center rounded-md bg-taling-pink text-base font-extrabold text-white hover:bg-taling-pink-600",
              )}
            >
              강의 결제하기
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
