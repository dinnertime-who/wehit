"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/shared/types/service.type";

type Props = {
  service: Service;
  onPaymentClick: () => void;
};

export const ServiceDetailHero = ({ service, onPaymentClick }: Props) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const displayPrice = service.salePrice || service.price;
  const originalPrice = service.salePrice ? service.price : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - service.salePrice!) / originalPrice) * 100)
    : null;

  return (
    <div className="space-y-8">
      {/* Hero Media */}
      <div className="relative w-full aspect-video bg-neutral-100 rounded-lg overflow-hidden">
        {service.coverVideoUrl && !isVideoOpen ? (
          <>
            <Image
              src={service.coverImageUrl}
              alt={service.title}
              fill
              className="object-cover"
            />
            <button
              onClick={() => setIsVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 hover:bg-white transition-colors">
                <Play className="w-6 h-6 text-black fill-black" />
              </div>
            </button>
          </>
        ) : isVideoOpen && service.coverVideoUrl ? (
          <video
            autoPlay
            controls
            className="w-full h-full object-cover"
          >
            <source src={service.coverVideoUrl} type="video/mp4" />
            브라우저가 비디오를 지원하지 않습니다.
          </video>
        ) : (
          <Image
            src={service.coverImageUrl}
            alt={service.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              {service.category}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{service.title}</h1>
            <p className="text-lg text-muted-foreground">{service.subtitle}</p>
          </div>

          <div className="flex items-start gap-6 pt-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">강사</p>
              <p className="font-medium">{service.tutorInfo}</p>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-20">
            <div>
              <div className="space-y-2">
                {originalPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{displayPrice.toLocaleString()}원</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {originalPrice.toLocaleString()}원
                    </span>
                    {discount && (
                      <span className="text-sm font-bold text-red-600">
                        {discount}% 할인
                      </span>
                    )}
                  </div>
                )}
                {!originalPrice && (
                  <span className="text-3xl font-bold">
                    {displayPrice.toLocaleString()}원
                  </span>
                )}
              </div>
            </div>

            <Button
              size="lg"
              onClick={onPaymentClick}
              className="w-full"
            >
              수강 신청하기
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              수강 신청 후 바로 시작할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
