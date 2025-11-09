"use client";

import { Star } from "lucide-react";
import type { Review } from "@/shared/types/review.type";

type Props = {
  reviews: Review[];
};

export const ServiceDetailReviews = ({ reviews }: Props) => {
  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">수강후기</h2>
        <div className="rounded-lg border border-dashed p-12 text-center">
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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">수강후기</h2>

        {/* Rating Summary */}
        <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
            <div className="flex justify-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
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
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{review.writerName}</h3>
                <div className="flex items-center gap-2 mt-1">
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
                  <span className="text-sm text-muted-foreground">
                    {review.rating}점
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
