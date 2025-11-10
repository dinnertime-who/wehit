"use client";

import { useService } from "@/hooks/apis/services/use-service";
import { useReviews } from "@/hooks/apis/reviews/use-reviews";
import { ServiceDetail } from "@/components/reusable/platform/services/service-detail";

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
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <ServiceDetail service={service} reviews={reviews || []} />
      </div>
    </div>
  );
};
