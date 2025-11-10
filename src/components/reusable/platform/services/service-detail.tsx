"use client";

import { useState } from "react";
import { PaymentDialog } from "@/components/reusable/platform/payment-dialog";
import { ServiceDetailHero } from "./service-detail-hero";
import { ServiceDetailDescription } from "./service-detail-description";
import { ServiceDetailReviews } from "./service-detail-reviews";
import type { Service } from "@/shared/types/service.type";
import type { Review } from "@/shared/types/review.type";

type Props = {
  service: Service;
  reviews: Review[];
};

export const ServiceDetail = ({ service, reviews }: Props) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <>
      <div className="space-y-20">
        <ServiceDetailHero
          service={service}
          onPaymentClick={() => setIsPaymentOpen(true)}
        />

        <div className="border-t border-border/50 pt-16">
          <ServiceDetailDescription description={service.description} />
        </div>

        <div className="border-t border-border/50 pt-16">
          <ServiceDetailReviews reviews={reviews} />
        </div>
      </div>

      <PaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        service={service}
      />
    </>
  );
};
