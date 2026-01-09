"use client";

import {
  Calendar,
  Check,
  Clock,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { usePaymentDialog } from "@/components/reusable/platform/payment-dialog";

import type {
  PlanType,
  ServicePlanFormatted,
} from "@/shared/types/service.type";

type Props = {
  plans: Record<PlanType, ServicePlanFormatted>;
  onInquiry?: () => void;
  onPurchase?: (planType: PlanType) => void;
};

export function ServicePlanCard({ plans, onInquiry, onPurchase }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("STANDARD");
  const { setOpen, setTotalPrice } = usePaymentDialog();

  const currentPlan = plans[selectedPlan];

  const planTabs: { type: PlanType; label: string }[] = [
    { type: "STANDARD", label: "STANDARD" },
    { type: "DELUXE", label: "DELUXE" },
    { type: "PREMIUM", label: "PREMIUM" },
  ];

  return (
    <div className="w-full rounded-2xl border border-line-normal bg-white p-6">
      {/* Plan Tabs */}
      <div className="flex gap-2 rounded-lg bg-taling-gray-50 p-1">
        {planTabs.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => setSelectedPlan(tab.type)}
            className={`cursor-pointer flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              selectedPlan === tab.type
                ? "bg-white text-taling-pink-600 shadow-sm"
                : "text-taling-gray-500 hover:text-taling-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Price Section */}
      <div className="mt-6">
        {currentPlan.salePrice ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg text-taling-gray-400 line-through">
                {currentPlan.price.toLocaleString()}원
              </span>
              <span className="rounded bg-taling-pink-50 px-2 py-0.5 text-sm font-semibold text-taling-pink-600">
                {Math.round(
                  ((currentPlan.price - currentPlan.salePrice) /
                    currentPlan.price) *
                    100,
                )}
                % 할인
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-taling-pink-600">
                {currentPlan.salePrice.toLocaleString()}원
              </span>
              {currentPlan.hasVAT && (
                <span className="text-sm text-taling-gray-500">
                  (VAT 포함가)
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-taling-gray-900">
              {currentPlan.price.toLocaleString()}원
            </span>
            {currentPlan.hasVAT && (
              <span className="text-sm text-taling-gray-500">(VAT 포함가)</span>
            )}
          </div>
        )}
        <div className="mt-2 flex items-center gap-1 text-sm text-taling-pink-600">
          <FaInfoCircle className="h-4 w-4" />
          <span className="font-medium">무이자 할부 혜택</span>
        </div>
      </div>

      {/* Plan Title & Description */}
      {(currentPlan.title || currentPlan.description) && (
        <div className="mt-6">
          {currentPlan.title && (
            <h3 className="text-lg font-bold text-taling-gray-900">
              {currentPlan.title}
            </h3>
          )}
          {currentPlan.description && (
            <p className="mt-2 text-sm leading-relaxed text-taling-gray-600">
              {currentPlan.description}
            </p>
          )}
        </div>
      )}

      {/* Plan Details (Dynamic Key-Value) */}
      <div className="mt-6 space-y-3">
        {Object.entries(currentPlan.details).map(([key, value], index) => {
          const isBoolean = typeof value === "boolean";
          const isNumber = typeof value === "number";
          
          return (
            <div
              key={key}
              className={`flex items-center justify-between ${
                index > 0 && index % 3 === 0
                  ? "border-t border-taling-gray-100 pt-3"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {isBoolean ? (
                  <Check
                    className={`h-5 w-5 ${
                      value
                        ? "text-taling-pink-600"
                        : "text-taling-gray-300"
                    }`}
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-taling-gray-100 flex items-center justify-center">
                    <span className="text-xs text-taling-gray-600">
                      {isNumber ? "#" : "T"}
                    </span>
                  </div>
                )}
                <span className="text-sm text-taling-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
              <span
                className={`text-sm ${
                  isBoolean
                    ? "text-2xl"
                    : "font-semibold text-taling-gray-900"
                }`}
              >
                {isBoolean ? (value ? "👍" : "") : value.toString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onInquiry}
          className="flex-1 rounded-lg border border-line-normal bg-white px-6 py-3 text-sm font-bold text-taling-pink-600 transition-colors hover:bg-taling-gray-50"
        >
          문의하기
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setTotalPrice(currentPlan.salePrice || currentPlan.price);
            onPurchase?.(selectedPlan);
          }}
          className="flex-1 rounded-lg bg-taling-pink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-taling-pink-600"
        >
          구매하기
        </button>
      </div>
    </div>
  );
}
