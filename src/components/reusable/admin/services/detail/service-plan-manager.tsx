"use client";

import { ServicePlanForm } from "./service-plan-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServicePlans } from "@/hooks/apis/use-service-plans";
import { Loader2 } from "lucide-react";

type Props = {
  serviceId: string;
};

export const ServicePlanManager = ({ serviceId }: Props) => {
  const { data: plans, isLoading, error } = useServicePlans(serviceId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>플랜 관리</CardTitle>
          <CardDescription>
            STANDARD, DELUXE, PREMIUM 플랜을 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>플랜 관리</CardTitle>
          <CardDescription>
            STANDARD, DELUXE, PREMIUM 플랜을 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">
            플랜 정보를 불러오는데 실패했습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>플랜 관리</CardTitle>
        <CardDescription>
          STANDARD, DELUXE, PREMIUM 플랜을 설정합니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="STANDARD" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="STANDARD">
              STANDARD
              {plans?.STANDARD && (
                <span className="ml-2 text-xs text-green-600">✓</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="DELUXE">
              DELUXE
              {plans?.DELUXE && (
                <span className="ml-2 text-xs text-green-600">✓</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="PREMIUM">
              PREMIUM
              {plans?.PREMIUM && (
                <span className="ml-2 text-xs text-green-600">✓</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="STANDARD" className="mt-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                기본 플랜입니다. 최소한 STANDARD 플랜은 반드시 생성해주세요.
              </div>
              <ServicePlanForm
                serviceId={serviceId}
                planType="STANDARD"
                existingPlan={plans?.STANDARD}
              />
            </div>
          </TabsContent>

          <TabsContent value="DELUXE" className="mt-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                중급 플랜입니다. STANDARD보다 더 많은 혜택을 제공합니다.
              </div>
              <ServicePlanForm
                serviceId={serviceId}
                planType="DELUXE"
                existingPlan={plans?.DELUXE}
              />
            </div>
          </TabsContent>

          <TabsContent value="PREMIUM" className="mt-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                프리미엄 플랜입니다. 가장 많은 혜택을 제공합니다.
              </div>
              <ServicePlanForm
                serviceId={serviceId}
                planType="PREMIUM"
                existingPlan={plans?.PREMIUM}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
