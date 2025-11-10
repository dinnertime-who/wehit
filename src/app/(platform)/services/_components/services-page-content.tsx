"use client";

import Link from "next/link";
import { ClassCard } from "@/components/reusable/platform/class-card";
import { useServicesWithStats } from "@/hooks/apis/services/use-services-with-stats";
import { convertServiceToClassItem } from "@/utils/display";

export function ServicesPageContent() {
  const { data: services } = useServicesWithStats();

  const classes = services.map(convertServiceToClassItem);

  return (
    <div className="app-container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">전체 강의</h1>
        <p className="text-muted-foreground">
          모든 강의를 확인하고 원하는 강의를 찾아보세요
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">등록된 강의가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              href={
                `/services/${classItem.id}` as React.ComponentProps<
                  typeof Link
                >["href"]
              }
              category={classItem.category}
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
      )}
    </div>
  );
}

