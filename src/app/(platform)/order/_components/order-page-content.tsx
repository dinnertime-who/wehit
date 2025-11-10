"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/hooks/apis/auth/use-session";
import { useCreateOrder } from "@/hooks/apis/orders/use-create-order";
import { useService } from "@/hooks/apis/services/use-service";
import { useSiteSetting } from "@/hooks/apis/site-settings/use-site-setting";
import { isProfileCompleted } from "@/utils/user";

export function OrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const createOrderMutation = useCreateOrder();
  const { data: siteSetting } = useSiteSetting("site-account");
  const { data: service, isLoading: isServiceLoading } = useService(
    serviceId || "",
  );
  const { data: session } = useSession();

  const handleOrder = async () => {
    if (!serviceId || !service) {
      toast.error("서비스를 선택해주세요");
      return;
    }

    // 추가 정보 체크
    if (session?.user) {
      const user = session.user as {
        phone?: string | null;
        birthDate?: string | Date | null;
        gender?: string | null;
        profileCompleted?: boolean | null;
      };
      if (!isProfileCompleted(user)) {
        setShowProfileDialog(true);
        return;
      }
    }

    const order = await createOrderMutation.mutateAsync({
      items: [
        {
          serviceId,
          quantity: 1,
          price: service.price,
          salePrice: service.salePrice || undefined,
        },
      ],
      paymentMethod: "bank_transfer",
      paymentInfo: {},
    });

    router.push(`/order/complete?orderId=${order.id}`);
  };

  const handleGoToAdditionalInfo = () => {
    setShowProfileDialog(false);
    router.push("/additional-info");
  };

  if (!serviceId) {
    return (
      <div className="app-container px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">주문/결제</h1>
          <p className="text-muted-foreground">서비스를 선택해주세요</p>
        </div>
      </div>
    );
  }

  if (isServiceLoading) {
    return (
      <div className="app-container px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="app-container px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">주문/결제</h1>
          <p className="text-muted-foreground">서비스를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const price = service.salePrice || service.price;
  const accountNumber = siteSetting?.value || "0000-0000-0000";

  return (
    <div className="app-container px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">주문/결제</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 주문 정보 */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">강의명</p>
                  <p className="font-semibold">{service.title}</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      수강료
                    </span>
                    <span className="text-lg font-bold">
                      {price.toLocaleString()}원
                    </span>
                  </div>
                  {service.salePrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground line-through">
                        {service.price.toLocaleString()}원
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 결제 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 mb-2">
                    아래 계좌번호로 입금해주세요
                  </p>
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <span className="font-mono font-bold">{accountNumber}</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">
                    주의사항
                  </h4>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                    <li>입금 후 확인 검수가 있을 수 있습니다</li>
                    <li>정확한 금액을 입금해주세요</li>
                    <li>문의사항은 고객센터로 연락주세요</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{price.toLocaleString()}원</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">총 결제금액</span>
                    <span className="text-xl font-bold">
                      {price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 주문 버튼 */}
            <Button
              onClick={handleOrder}
              disabled={createOrderMutation.isPending || !service}
              className="w-full"
              size="lg"
            >
              {createOrderMutation.isPending ? (
                <>
                  <Spinner className="mr-2" />
                  주문 처리 중...
                </>
              ) : (
                "주문하기"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 추가 정보 입력 안내 다이얼로그 */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>추가 정보 입력 필요</DialogTitle>
            <DialogDescription>
              서비스 구매를 위해 추가 정보 입력이 필요합니다.
              <br />
              전화번호, 생년월일, 성별을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProfileDialog(false)}
            >
              취소
            </Button>
            <Button onClick={handleGoToAdditionalInfo}>
              추가 정보 입력하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
