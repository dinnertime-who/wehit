import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PlanType,
  ServicePlanFormatted,
  CreateServicePlanDTO,
  UpdateServicePlanDTO,
  ServicePlan,
} from "@/shared/types/service.type";

// Query Keys
export const servicePlanKeys = {
  all: ["service-plans"] as const,
  byService: (serviceId: string) => [...servicePlanKeys.all, serviceId] as const,
};

// API Functions
async function fetchServicePlans(
  serviceId: string,
): Promise<Record<PlanType, ServicePlanFormatted>> {
  const response = await fetch(`/api/services/${serviceId}/plans`);
  if (!response.ok) {
    throw new Error("플랜 조회 실패");
  }
  return response.json();
}

async function createServicePlan(
  data: CreateServicePlanDTO,
): Promise<ServicePlan> {
  const response = await fetch(`/api/services/${data.serviceId}/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("플랜 생성 실패");
  }
  return response.json();
}

async function updateServicePlan(params: {
  serviceId: string;
  planType: PlanType;
  data: UpdateServicePlanDTO;
}): Promise<ServicePlan> {
  const response = await fetch(
    `/api/services/${params.serviceId}/plans/${params.planType}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.data),
    },
  );
  if (!response.ok) {
    throw new Error("플랜 수정 실패");
  }
  return response.json();
}

async function deleteServicePlan(params: {
  serviceId: string;
  planType: PlanType;
}): Promise<{ success: boolean }> {
  const response = await fetch(
    `/api/services/${params.serviceId}/plans/${params.planType}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("플랜 삭제 실패");
  }
  return response.json();
}

// Hooks
export function useServicePlans(serviceId: string) {
  return useQuery({
    queryKey: servicePlanKeys.byService(serviceId),
    queryFn: () => fetchServicePlans(serviceId),
    enabled: !!serviceId,
  });
}

export function useCreateServicePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServicePlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: servicePlanKeys.byService(variables.serviceId),
      });
    },
  });
}

export function useUpdateServicePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServicePlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: servicePlanKeys.byService(variables.serviceId),
      });
    },
  });
}

export function useDeleteServicePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServicePlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: servicePlanKeys.byService(variables.serviceId),
      });
    },
  });
}
