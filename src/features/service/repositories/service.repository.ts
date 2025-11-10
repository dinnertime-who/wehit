import "server-only";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { service } from "@/infrastructure/db/schema";
import type {
  CreateServiceDTO,
  UpdateServiceDTO,
  Service,
} from "@/shared/types/service.type";

export type ServiceListFilters = {
  category?: string;
  search?: string;
};

export type ServiceListParams = {
  page?: number;
  limit?: number;
  filters?: ServiceListFilters;
};

export type PaginatedServiceResult = {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

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

  static async getPaginated(
    params: ServiceListParams = {},
  ): Promise<PaginatedServiceResult> {
    const { page = 1, limit = 12, filters = {} } = params;
    const offset = (page - 1) * limit;

    // 필터 조건 구성
    const conditions = [];
    if (filters.category) {
      conditions.push(eq(service.category, filters.category));
    }
    if (filters.search) {
      conditions.push(
        or(
          ilike(service.title, `%${filters.search}%`),
          ilike(service.subtitle, `%${filters.search}%`),
        )!,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 총 개수 조회
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(service)
      .where(whereClause);
    const total = totalResult[0]?.count ?? 0;

    // 데이터 조회
    const results = await db
      .select()
      .from(service)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(service.createdAt));

    const totalPages = Math.ceil(total / limit);

    return {
      data: results as Service[],
      total,
      page,
      limit,
      totalPages,
    };
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
