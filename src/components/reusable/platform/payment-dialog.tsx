"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSiteSetting } from "@/hooks/apis/site-settings/use-site-setting";
import type { Service } from "@/shared/types/service.type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
};

export const PaymentDialog = ({ open, onOpenChange, service }: Props) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>수강 신청</DialogTitle>
          <DialogDescription>
            아래 계좌로 입금 후 수강을 시작할 수 있습니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="space-y-2 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-muted-foreground">강의명</p>
            <h3 className="font-bold text-foreground">{service.title}</h3>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">수강료</p>
              <p className="text-2xl font-bold text-foreground">
                {(service.salePrice || service.price).toLocaleString()}원
              </p>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">입금 정보</h4>
            <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                아래 계좌번호로 수강료를 입금해주세요
              </p>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="font-mono font-bold text-foreground">
                  {accountNumber}
                </span>
                <button
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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
