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
                {Math.round(((currentPlan.price - currentPlan.salePrice) / currentPlan.price) * 100)}% 할인
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-taling-pink-600">
                {currentPlan.salePrice.toLocaleString()}원
              </span>
              {currentPlan.hasVAT && (
                <span className="text-sm text-taling-gray-500">(VAT 포함가)</span>
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

      {/* Features */}
      <div className="mt-6 space-y-3">
        {/* 누끼작업 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check
              className={`h-5 w-5 ${
                currentPlan.features.canRetouch
                  ? "text-taling-pink-600"
                  : "text-taling-gray-300"
              }`}
            />
            <span className="text-sm text-taling-gray-700">누끼작업</span>
          </div>
          <span className="text-2xl">
            {currentPlan.features.canRetouch ? "👍" : ""}
          </span>
        </div>

        {/* 보정작업 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check
              className={`h-5 w-5 ${
                currentPlan.features.canPostprocess
                  ? "text-taling-pink-600"
                  : "text-taling-gray-300"
              }`}
            />
            <span className="text-sm text-taling-gray-700">보정작업</span>
          </div>
          <span className="text-2xl">
            {currentPlan.features.canPostprocess ? "👍" : ""}
          </span>
        </div>

        {/* 촬영 시간 */}
        <div className="flex items-center justify-between border-t border-taling-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-taling-gray-400" />
            <span className="text-sm text-taling-gray-700">촬영 시간 (분)</span>
          </div>
          <span className="text-sm font-semibold text-taling-gray-900">
            {currentPlan.shootingTime}분
          </span>
        </div>

        {/* 이미지 첫 수 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-taling-gray-400" />
            <span className="text-sm text-taling-gray-700">이미지 첫 수</span>
          </div>
          <span className="text-sm font-semibold text-taling-gray-900">
            {currentPlan.imageCount}첫
          </span>
        </div>

        {/* 작업일 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-taling-gray-400" />
            <span className="text-sm text-taling-gray-700">작업일</span>
          </div>
          <span className="text-sm font-semibold text-taling-gray-900">
            {currentPlan.workingDays}일
          </span>
        </div>

        {/* 수정 횟수 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-taling-gray-400" />
            <span className="text-sm text-taling-gray-700">수정 횟수</span>
          </div>
          <span className="text-sm font-semibold text-taling-gray-900">
            {currentPlan.revisionCount}회
          </span>
        </div>
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
