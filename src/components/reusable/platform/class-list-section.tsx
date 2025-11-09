"use client";

import type Link from "next/link";
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
};

export function ClassListSection({ classes, title }: Props) {
  return (
    <section className="py-12">
      <div className="app-container px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
