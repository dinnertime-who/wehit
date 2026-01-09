import "server-only";

import { eq, and } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { servicePlan } from "@/infrastructure/db/schema";
import type {
  CreateServicePlanDTO,
  UpdateServicePlanDTO,
  ServicePlan,
  PlanType,
} from "@/shared/types/service.type";

export class ServicePlanRepository {
  static async create(data: CreateServicePlanDTO): Promise<ServicePlan> {
    const [result] = await db.insert(servicePlan).values(data).returning();
    return result as ServicePlan;
  }

  static async getByServiceId(serviceId: string): Promise<ServicePlan[]> {
    const results = await db.query.servicePlan.findMany({
      where: eq(servicePlan.serviceId, serviceId),
    });
    return results as ServicePlan[];
  }

  static async getByServiceIdAndPlanType(
    serviceId: string,
    planType: PlanType,
  ): Promise<ServicePlan | null> {
    const result = await db.query.servicePlan.findFirst({
      where: and(
        eq(servicePlan.serviceId, serviceId),
        eq(servicePlan.planType, planType),
      ),
    });
    return result as ServicePlan | null;
  }

  static async update(
    serviceId: string,
    planType: PlanType,
    data: UpdateServicePlanDTO,
  ): Promise<ServicePlan | null> {
    const [result] = await db
      .update(servicePlan)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(servicePlan.serviceId, serviceId),
          eq(servicePlan.planType, planType),
        ),
      )
      .returning();
    return result as ServicePlan | null;
  }

  static async delete(serviceId: string, planType: PlanType): Promise<boolean> {
    const result = await db
      .delete(servicePlan)
      .where(
        and(
          eq(servicePlan.serviceId, serviceId),
          eq(servicePlan.planType, planType),
        ),
      );
    return (result.rowCount ?? 0) > 0;
  }

  static async deleteByServiceId(serviceId: string): Promise<boolean> {
    const result = await db
      .delete(servicePlan)
      .where(eq(servicePlan.serviceId, serviceId));
    return (result.rowCount ?? 0) > 0;
  }
}
