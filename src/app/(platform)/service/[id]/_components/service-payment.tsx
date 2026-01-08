"use client";

import { Calendar, Share2, Star, Users } from "lucide-react";
import { useState } from "react";
import { ScheduleCard } from "./schedule-card";

type Schedule = {
  id: string;
  scheduleType: "flexible" | "fixed";
  scheduleDescription?: string;
  location: string;
  locationDetail?: string;
};

type ClassInfo = {
  type: "group" | "individual" | "oneday";
  maxParticipants?: number;
  duration: number; // in hours
  durationUnit: "시간" | "개월";
};

type Props = {
  title: string;
  reviewRating: number;
  reviewCount: number;
  pricePerHour: number;
  totalAmount: number;
  totalHours: number;
  classInfo: ClassInfo;
  schedules: Schedule[];
};

export function ServicePayment(props: Props) {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    props.schedules.length > 0 ? props.schedules[0].id : null,
  );

  const getClassTypeLabel = () => {
    switch (props.classInfo.type) {
      case "group":
        return "그룹 클래스";
      case "individual":
        return "1:1 클래스";
      case "oneday":
        return "원데이";
      default:
        return "";
    }
  };

  return (
    <div
      id="vod-widget"
      className="h-fit w-full rounded-lg pt-6 md:sticky md:top-[100px] md:min-w-[384px] md:border md:border-line-normal md:p-6"
    >
      <section className="flex items-center justify-between gap-1">
        <h1 className="mt-3 whitespace-pre-wrap text-heading1-bold text-normal">
          {props.title}
        </h1>
        <div className="md:hidden">
          <div className="cursor-pointer rounded-full hover:bg-taling-gray-100 p-2">
            <Share2 className="h-5 w-5" />
          </div>
        </div>
      </section>

      <div className="mt-1.5">
        <div className="flex items-center justify-start gap-s20">
          <div className="flex items-center whitespace-nowrap gap-1 text-body1normal-medium cursor-pointer">
            <Star className="h-s20 w-s20 text-palette-orange-300 fill-current" />
            <span className="flex items-center">
              {props.reviewRating.toFixed(1)} ({props.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <div className="my-4 flex justify-between">
        <div>
          <p className="text-xl font-semibold text-taling-gray-800">
            {props.pricePerHour.toLocaleString()}
            <span className="text-sm">원</span>
            <span className="text-xs">/시간</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex h-20 w-full flex-col justify-center gap-1 rounded-md bg-taling-gray-50 px-4 font-medium">
          <p className="text-sm text-taling-gray-700">
            총 {props.totalHours}시간
          </p>
          <p className="">{props.totalAmount.toLocaleString()}원</p>
        </div>

        <div className="mx-2 flex flex-col gap-4 border-y border-taling-gray-200 py-4 text-taling-gray-700">
          <div className="flex flex-col gap-4">
            {props.classInfo.maxParticipants && (
              <div className="flex gap-4">
                <Users className="h-6 w-6" />
                {getClassTypeLabel()} · {props.classInfo.maxParticipants}인
              </div>
            )}
            <div className="flex gap-4">
              <Calendar className="h-6 w-6" />
              <div>
                {props.classInfo.duration}
                {props.classInfo.durationUnit}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pb-4">
        <div className="text-sm">
          <h2 className="mt-6 pb-2 text-lg font-semibold">일정 선택</h2>
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
      </div>

      <div className="fixed bottom-0 left-0 z-navigation w-full bg-white bg-opacity-80 px-4 py-2 backdrop-blur-md md:static md:ml-0 md:mt-4 md:p-0">
        <div className="flex w-full items-start gap-2">
          <div className="relative w-full">
            <div className="relative w-full">
              <a className="flex flex-col" href="#a">
                <div className="flex items-center justify-center h-12 bg-taling-pink hover:bg-taling-pink-600 tracking-wider text-white rounded-md text-sm font-bold">
                  클래스 결제하기
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
