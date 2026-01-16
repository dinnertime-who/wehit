"use client";

import { PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PaymentDialog } from "@/components/reusable/platform/payment-dialog";
import { useSession } from "@/hooks/apis/auth/use-session";
import { useReviews } from "@/hooks/apis/reviews/use-reviews";
import { useService } from "@/hooks/apis/services/use-service";
import { useServicePlans } from "@/hooks/apis/use-service-plans";
import { useServiceSchedules } from "@/hooks/apis/use-service-schedules";
import { Service } from "./service";
import { ServicePayment } from "./service-payment";

type Props = {
  serviceId: string;
};

export const ServiceDetailPage = ({ serviceId }: Props) => {
  const { data: session } = useSession();
  const { data: service } = useService(serviceId);
  const { data: reviews } = useReviews(serviceId);
  const { data: plans } = useServicePlans(serviceId);
  const { data: schedules } = useServiceSchedules(serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">강의를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container py-12 md:py-16">
        {session && session.user.role === "admin" && (
          <div className="flex justify-end mb-4">
            <Link
              href={`/admin/services/${service.id}`}
              className="flex items-center gap-2"
              target="_blank"
            >
              <PencilIcon className="w-4 h-4" />
              서비스 수정하러 가기
            </Link>
          </div>
        )}

        <div className="block md:hidden">
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
              <div>
                {service.coverVideoUrl && (
                  <video
                    tabIndex={-1}
                    loop
                    muted
                    autoPlay
                    playsInline
                    src={service.coverVideoUrl}
                  />
                )}
                {service.coverImageUrl && (
                  <Image
                    className="object-cover"
                    src={service.coverImageUrl}
                    alt="service"
                    width={824}
                    height={464}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-10 md:flex-row">
          <Service
            id={service.id}
            videoUrl={service.coverVideoUrl}
            imageUrl={service.coverImageUrl}
            detailImages={service.description}
            reviews={
              reviews?.map((r) => ({
                id: r.id,
                author: r.writerName,
                rating: r.rating,
                content: r.content,
                isBest: r.isBest,
                date: new Date(r.createdAt).toLocaleDateString("ko-KR"),
              })) || []
            }
            reviewCount={reviews?.length || 0}
            plans={plans}
          />
          <ServicePayment
            title={service.title}
            reviewRating={
              reviews?.reduce((acc, r) => acc + r.rating, 0) /
                reviews?.length || 0
            }
            originalPrice={plans?.STANDARD?.price || 0}
            salePrice={plans?.STANDARD?.salePrice || 0}
            reviewCount={reviews?.length || 0}
            totalAmount={
              plans?.STANDARD?.salePrice || plans?.STANDARD?.price || 0
            }
            // schedules={schedules?.map((s) => ({
            //   id: s.id,
            //   scheduleType: s.scheduleType,
            //   scheduleDescription: s.scheduleDescription || "",
            //   location: s.location,
            //   locationDetail: s.locationDetail || "",
            // }))}
            vodInfo={{
              totalLessons: 10,
              totalDuration: "10시간",
              hasQnA: true,
              isLifetimeAccess: true,
            }}
          />
        </div>
      </div>

      <PaymentDialog service={service} />
    </div>
  );
};
