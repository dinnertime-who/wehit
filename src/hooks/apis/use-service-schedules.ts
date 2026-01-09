import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ServiceSchedule,
  CreateServiceScheduleDTO,
  UpdateServiceScheduleDTO,
} from "@/shared/types/service.type";

// Query Keys
export const serviceScheduleKeys = {
  all: ["service-schedules"] as const,
  byService: (serviceId: string) =>
    [...serviceScheduleKeys.all, serviceId] as const,
  byId: (scheduleId: string) =>
    [...serviceScheduleKeys.all, "detail", scheduleId] as const,
};

// API Functions
async function fetchServiceSchedules(
  serviceId: string,
): Promise<ServiceSchedule[]> {
  const response = await fetch(`/api/services/${serviceId}/schedules`);
  if (!response.ok) {
    throw new Error("스케줄 조회 실패");
  }
  return response.json();
}

async function createServiceSchedule(
  data: CreateServiceScheduleDTO,
): Promise<ServiceSchedule> {
  const response = await fetch(`/api/services/${data.serviceId}/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("스케줄 생성 실패");
  }
  return response.json();
}

async function updateServiceSchedule(params: {
  serviceId: string;
  scheduleId: string;
  data: UpdateServiceScheduleDTO;
}): Promise<ServiceSchedule> {
  const response = await fetch(
    `/api/services/${params.serviceId}/schedules/${params.scheduleId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.data),
    },
  );
  if (!response.ok) {
    throw new Error("스케줄 수정 실패");
  }
  return response.json();
}

async function deleteServiceSchedule(params: {
  serviceId: string;
  scheduleId: string;
}): Promise<{ success: boolean }> {
  const response = await fetch(
    `/api/services/${params.serviceId}/schedules/${params.scheduleId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("스케줄 삭제 실패");
  }
  return response.json();
}

// Hooks
export function useServiceSchedules(serviceId: string) {
  return useQuery({
    queryKey: serviceScheduleKeys.byService(serviceId),
    queryFn: () => fetchServiceSchedules(serviceId),
    enabled: !!serviceId,
  });
}

export function useCreateServiceSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: serviceScheduleKeys.byService(variables.serviceId),
      });
    },
  });
}

export function useUpdateServiceSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServiceSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: serviceScheduleKeys.byService(variables.serviceId),
      });
    },
  });
}

export function useDeleteServiceSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServiceSchedule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: serviceScheduleKeys.byService(variables.serviceId),
      });
    },
  });
}
