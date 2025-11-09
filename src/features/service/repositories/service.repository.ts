import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { service } from "@/infrastructure/db/schema";
import type {
  CreateServiceDTO,
  UpdateServiceDTO,
  Service,
} from "@/shared/types/service.type";

export class ServiceRepository {
  static async create(data: CreateServiceDTO): Promise<Service> {
    const [result] = await db.insert(service).values(data).returning();
    return result as Service;
  }

  static async getById(id: string): Promise<Service | null> {
    const result = await db.query.service.findFirst({
      where: eq(service.id, id),
    });
    return result as Service | null;
  }

  static async getAll(): Promise<Service[]> {
    const results = await db.query.service.findMany();
    return results as Service[];
  }

  static async update(
    id: string,
    data: UpdateServiceDTO,
  ): Promise<Service | null> {
    const [result] = await db
      .update(service)
      .set(data)
      .where(eq(service.id, id))
      .returning();
    return result as Service | null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(service).where(eq(service.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
