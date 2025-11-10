"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrder } from "@/hooks/apis/orders/use-order";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2 } from "lucide-react";

export function OrderCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: order, isLoading } = useOrder(orderId || "");

  if (!orderId) {
    return (
      <div className="app-container px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">주문 완료</h1>
          <p className="text-muted-foreground">주문 정보를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-container px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="app-container px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">주문 완료</h1>
          <p className="text-muted-foreground">주문을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다</h1>
          <p className="text-muted-foreground">
            주문번호: <span className="font-mono">{order.orderNumber}</span>
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문번호</span>
              <span className="font-mono">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문 상태</span>
              <span>
                {order.status === "pending" && "대기중"}
                {order.status === "paid" && "결제완료"}
                {order.status === "cancelled" && "취소됨"}
                {order.status === "completed" && "완료"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">총 금액</span>
              <span className="text-lg font-bold">
                {order.totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/mypage/purchase-history">구매 내역 보기</Link>
          </Button>
          <Button asChild>
            <Link href="/service">서비스 더 보기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

