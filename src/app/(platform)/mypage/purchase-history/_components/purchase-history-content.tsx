"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/apis/orders/use-orders";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function PurchaseHistoryContent() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="app-container px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="app-container px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">구매 내역</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">구매 내역이 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">구매 내역</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">주문번호</p>
                <p className="font-mono font-semibold">{order.orderNumber}</p>
              </div>
              <Badge variant={getStatusVariant(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">주문일시</p>
                <p className="text-sm">
                  {new Date(order.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">총 금액</p>
                <p className="text-lg font-bold">
                  {order.totalAmount.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button asChild variant="outline" size="sm">
                <Link href={`/mypage/purchase-history/${order.id}`}>
                  상세 보기
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

