"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
    <div className="space-y-12">
      {/* Hero Media */}
      <div className="relative w-full aspect-video bg-neutral-100 rounded-xl overflow-hidden shadow-lg">
        {service.coverVideoUrl && !isVideoOpen ? (
          <>
            <Image
              src={service.coverImageUrl}
              alt={service.title}
              fill
              className="object-cover"
            />
            <button
              type="button"
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
            muted
            loop
            playsInline
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
            unoptimized
          />
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
              {service.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {service.subtitle}
            </p>
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
          <div className="border rounded-xl p-6 space-y-6 sticky top-24 bg-card shadow-lg">
            <div>
              <div className="space-y-3">
                {originalPrice && (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-foreground">
                        {displayPrice.toLocaleString()}원
                      </span>
                      <span className="text-base text-muted-foreground line-through">
                        {originalPrice.toLocaleString()}원
                      </span>
                    </div>
                    {discount && (
                      <div className="inline-block px-3 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-full">
                        {discount}% 할인
                      </div>
                    )}
                  </div>
                )}
                {!originalPrice && (
                  <span className="text-3xl font-bold text-foreground">
                    {displayPrice.toLocaleString()}원
                  </span>
                )}
              </div>
            </div>

            <Button
              size="lg"
              onClick={onPaymentClick}
              className="w-full h-12 text-base font-semibold"
            >
              수강 신청하기
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              수강 신청 후 바로 시작할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
