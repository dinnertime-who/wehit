"use client";

import type Link from "next/link";
import { cn } from "@/lib/utils";
import { ClassCard } from "./class-card";

// 샘플 데이터
type Props = {
  title: string;
  classes: {
    id: string;
    title: string;
    tutor: string;
    discountRate: number;
    originalPrice: number;
    salePrice: number;
    reviewCount: number;
    thumbnail: string;
    rating: number;
  }[];
  className?: string;
};

export function ClassListSection({ classes, title, className = "" }: Props) {
  return (
    <section className={cn("py-6 lg:py-12", className)}>
      <div className="app-container px-4">
        <div className="mb-5">
          <h2 className="text-heading-3">{title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              href={
                `/service/${classItem.id.toString()}` as React.ComponentProps<
                  typeof Link
                >["href"]
              }
              category={"VOD"}
              title={classItem.title}
              tutor={classItem.tutor}
              discountRate={classItem.discountRate}
              originalPrice={classItem.originalPrice}
              salePrice={classItem.salePrice}
              reviewCount={classItem.reviewCount}
              reviewRating={classItem.rating}
              thumbnailUrl={classItem.thumbnail}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
