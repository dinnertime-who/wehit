export type ClassType = "group" | "individual" | "oneday";
export type DurationUnit = "시간" | "개월";

export type Service = {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  tutorInfo: string;
  coverImageUrl: string;
  coverVideoUrl: string | null;
  description: string; // HTML content from Tiptap
  classType: ClassType | null;
  maxParticipants: number | null;
  duration: number | null;
  durationUnit: DurationUnit | null;
  createdAt: Date;
  updatedAt: Date;
};

// Service with price from STANDARD plan
export type ServiceWithPrice = Service & {
  price: number;
  salePrice: number | null;
};

export type CreateServiceDTO = {
  title: string;
  subtitle?: string;
  category: string;
  tutorInfo: string;
  coverImageUrl: string;
  coverVideoUrl?: string;
  description: string;
  classType?: ClassType;
  maxParticipants?: number;
  duration?: number;
  durationUnit?: DurationUnit;
};

export type UpdateServiceDTO = Partial<CreateServiceDTO>;

// Service Plan Types
export type PlanType = "STANDARD" | "DELUXE" | "PREMIUM";

// Key-value 형태로 자유롭게 플랜 상세 정보 관리
export type PlanDetails = Record<string, string | number | boolean>;

export type ServicePlan = {
  id: string;
  serviceId: string;
  planType: PlanType;
  price: number;
  salePrice: number | null;
  title: string | null;
  description: string | null;
  hasVAT: boolean;
  details: PlanDetails;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateServicePlanDTO = {
  serviceId: string;
  planType: PlanType;
  price: number;
  salePrice?: number;
  title?: string;
  description?: string;
  hasVAT?: boolean;
  details: PlanDetails;
};

export type UpdateServicePlanDTO = Partial<
  Omit<CreateServicePlanDTO, "serviceId" | "planType">
>;

// Frontend-friendly format (flattened with dynamic details)
export type ServicePlanFormatted = {
  price: number;
  salePrice: number | null;
  title: string | null;
  description: string | null;
  hasVAT: boolean;
  details: PlanDetails; // key-value 형태
};

// Service Schedule Types
export type ScheduleType = "flexible" | "fixed";

export type ServiceSchedule = {
  id: string;
  serviceId: string;
  scheduleType: ScheduleType;
  scheduleDescription: string | null;
  location: string;
  locationDetail: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateServiceScheduleDTO = {
  serviceId: string;
  scheduleType: ScheduleType;
  scheduleDescription?: string;
  location: string;
  locationDetail?: string;
};

export type UpdateServiceScheduleDTO = Partial<
  Omit<CreateServiceScheduleDTO, "serviceId">
>;
