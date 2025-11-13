"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/reusable/forms/app-form/app-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useSiteSetting } from "@/hooks/apis/site-settings/use-site-setting";
import { useUpdateSiteSetting } from "@/hooks/apis/site-settings/use-update-site-setting";

const paymentAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(1, "계좌번호를 입력해주세요")
    .regex(/^[\d-]+$/, "계좌번호는 숫자와 하이픈(-)만 입력 가능합니다"),
});

type PaymentAccountFormValues = z.infer<typeof paymentAccountSchema>;

export function SettingsContent() {
  const router = useRouter();
  const { data: siteAccount } = useSiteSetting("site-account");
  const updateMutation = useUpdateSiteSetting("site-account");

  const form = useAppForm({
    defaultValues: {
      accountNumber: siteAccount?.value || "0000-0000-0000",
    } as PaymentAccountFormValues,
    validators: {
      onSubmit: paymentAccountSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({
          value: value.accountNumber,
          description: "결제 계좌번호",
        });
        toast.success("결제 계좌 정보가 저장되었습니다");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다";
        console.error(error);
        toast.error(message);
      }
    },
  });

  const isLoading = updateMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>결제 계좌 정보</CardTitle>
          <CardDescription>
            주문 시 고객에게 안내할 입금 계좌번호를 설정합니다
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
        >
          <CardContent className="">
            <form.AppForm>
              <form.Fieldset className="space-y-4">
                <form.AppField name="accountNumber">
                  {(field) => (
                    <field.TextField
                      label="계좌번호"
                      required
                      disabled={isLoading}
                      placeholder="0000-0000-0000"
                    />
                  )}
                </form.AppField>
              </form.Fieldset>
            </form.AppForm>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
