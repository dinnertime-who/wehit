"use client";

import { useReviews } from "@/hooks/apis/reviews/use-reviews";
import { useService } from "@/hooks/apis/services/use-service";
import { Service } from "./service";
import { ServicePayment } from "./service-payment";

type Props = {
  serviceId: string;
};

export const ServiceDetailPage = ({ serviceId }: Props) => {
  const { data: service } = useService(serviceId);
  const { data: reviews } = useReviews(serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">강의를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container py-24">
        <div className="flex flex-col-reverse gap-10 md:flex-row">
          <Service
            videoUrl={service.coverVideoUrl}
            imageUrl={service.coverImageUrl}
            detailImages={service.description}
            reviews={
              reviews?.map((r) => ({
                id: r.id,
                author: r.writerName,
                rating: r.rating,
                content: r.content,
                date: new Date(r.createdAt).toLocaleDateString("ko-KR"),
              })) || []
            }
            activeTab="intro"
            reviewCount={reviews?.length || 0}
          />
          <ServicePayment
            title={service.title}
            reviewRating={
              reviews?.reduce((acc, r) => acc + r.rating, 0) /
                reviews?.length || 0
            }
            reviewCount={reviews?.length || 0}
            pricePerHour={service.price}
            totalAmount={service.price * 2}
            totalHours={2}
            classInfo={{
              type: "group",
              maxParticipants: 2,
              duration: 2,
              durationUnit: "시간",
            }}
            schedules={[
              {
                id: "1",
                scheduleType: "flexible",
                scheduleDescription: "메세지로 조율해요",
                location: "강남",
                locationDetail: "",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
