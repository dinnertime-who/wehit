import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { serviceSchedule } from "@/infrastructure/db/schema";
import type {
  CreateServiceScheduleDTO,
  UpdateServiceScheduleDTO,
  ServiceSchedule,
} from "@/shared/types/service.type";

export class ServiceScheduleRepository {
  static async create(data: CreateServiceScheduleDTO): Promise<ServiceSchedule> {
    const [result] = await db.insert(serviceSchedule).values(data).returning();
    return result as ServiceSchedule;
  }

  static async getByServiceId(serviceId: string): Promise<ServiceSchedule[]> {
    const results = await db.query.serviceSchedule.findMany({
      where: eq(serviceSchedule.serviceId, serviceId),
    });
    return results as ServiceSchedule[];
  }

  static async getById(id: string): Promise<ServiceSchedule | null> {
    const result = await db.query.serviceSchedule.findFirst({
      where: eq(serviceSchedule.id, id),
    });
    return result as ServiceSchedule | null;
  }

  static async update(
    id: string,
    data: UpdateServiceScheduleDTO,
  ): Promise<ServiceSchedule | null> {
    const [result] = await db
      .update(serviceSchedule)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceSchedule.id, id))
      .returning();
    return result as ServiceSchedule | null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(serviceSchedule)
      .where(eq(serviceSchedule.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  static async deleteByServiceId(serviceId: string): Promise<boolean> {
    const result = await db
      .delete(serviceSchedule)
      .where(eq(serviceSchedule.serviceId, serviceId));
    return (result.rowCount ?? 0) > 0;
  }
}
