"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSiteSetting } from "@/hooks/apis/site-settings/use-site-setting";
import type { Service } from "@/shared/types/service.type";

export const usePaymentDialog = create<{
  open: boolean;
  setOpen: (open: boolean) => void;
  totalPrice: number;
  setTotalPrice: (totalPrice: number) => void;
}>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  totalPrice: 0,
  setTotalPrice: (totalPrice) => set({ totalPrice }),
}));

export const PaymentDialog = ({ service }: { service: Service }) => {
  const { open, setOpen, totalPrice } = usePaymentDialog();
  const { data: siteSetting, isLoading } = useSiteSetting("site-account");
  const [copied, setCopied] = useState(false);

  const accountNumber = siteSetting?.value || "0000-0000-0000";

  const handleCopyAccount = async () => {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    toast.success("계좌번호가 복사되었습니다");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (open) {
      setCopied(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>결제 강의 정보</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="space-y-2 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-muted-foreground">강의명</p>
            <h3 className="font-bold text-foreground">{service.title}</h3>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">결제 금액</p>
              <p className="text-2xl font-bold text-foreground">
                {totalPrice.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">입금 정보</h4>
            <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                아래 계좌번호로 결제 금액을 입금해주세요
              </p>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="font-mono font-bold text-foreground">
                  {accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="p-2 hover:bg-neutral-100 rounded transition-colors"
                  title="계좌번호 복사"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-900">주의사항</h4>
            <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
              <li>입금 후 확인 검수가 있을 수 있습니다</li>
              <li>정확한 금액을 입금해주세요</li>
              <li>문의사항은 고객센터로 연락주세요</li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              닫기
            </Button>
            <Button
              variant="default"
              onClick={() => {
                window.alert("신청이 완료되었습니다.");
                setOpen(false);
              }}
              className="w-full bg-taling-pink text-white hover:bg-taling-pink-600"
            >
              결제하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
