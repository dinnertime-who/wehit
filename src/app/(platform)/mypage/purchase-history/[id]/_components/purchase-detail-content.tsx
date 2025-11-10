"use client";

import { useOrder } from "@/hooks/apis/orders/use-order";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "대기중";
    case "paid":
      return "결제완료";
    case "cancelled":
      return "취소됨";
    case "completed":
      return "완료";
    default:
      return status;
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "paid":
      return "default";
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

type Props = {
  orderId: string;
};

export function PurchaseDetailContent({ orderId }: Props) {
  const { data: order, isLoading } = useOrder(orderId);

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
          <h1 className="text-2xl font-bold mb-4">주문 상세</h1>
          <p className="text-muted-foreground">주문을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/mypage/purchase-history">← 구매 내역으로</Link>
          </Button>
        </div>

        <h1 className="text-2xl font-bold mb-8">주문 상세</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 주문 정보 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-mono">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 상태</span>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문일시</span>
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 방식</span>
                <span>
                  {order.paymentMethod === "bank_transfer" && "무통장 입금"}
                </span>
              </div>
            </div>
          </Card>

          {/* 결제 정보 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 금액</span>
                <span className="text-xl font-bold">
                  {order.totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 주문 항목 */}
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">주문 항목</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border rounded-lg"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.service.coverImageUrl}
                    alt={item.service.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.service.title}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>수량</span>
                      <span>{item.quantity}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span>단가</span>
                      <span>
                        {(item.salePrice || item.price).toLocaleString()}원
                      </span>
                    </div>
                    {item.salePrice && (
                      <div className="flex justify-between">
                        <span className="line-through text-muted-foreground">
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">소계</span>
                      <span className="font-semibold">
                        {((item.salePrice || item.price) * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

