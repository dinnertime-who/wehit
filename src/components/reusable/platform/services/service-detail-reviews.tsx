"use client";

import { Star } from "lucide-react";
import type { Review } from "@/shared/types/review.type";

type Props = {
  reviews: Review[];
};

export const ServiceDetailReviews = ({ reviews }: Props) => {
  if (reviews.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">수강후기</h2>
        <div className="rounded-xl border border-dashed border-border/50 p-12 text-center bg-muted/30">
          <p className="text-muted-foreground">아직 수강후기가 없습니다</p>
        </div>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">수강후기</h2>

        {/* Rating Summary */}
        <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3 font-medium">
              {reviews.length}개 평가
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-xl p-6 space-y-4 bg-card hover:shadow-md transition-all duration-300 hover:border-primary/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {review.writerName}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {review.rating}점
                  </span>
                </div>
              </div>
            </div>
            <p className="text-base text-foreground/90 leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
