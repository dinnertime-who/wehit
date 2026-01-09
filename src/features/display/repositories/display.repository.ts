import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import {
  display,
  displayService,
  review,
  service,
  servicePlan,
} from "@/infrastructure/db/schema";
import type {
  AddServiceToDisplayInput,
  CreateDisplayInput,
  Display,
  DisplayServiceRecord,
  DisplayWithServiceDetails,
  ReorderDisplayServicesInput,
  ServiceWithReviewStats,
  UpdateDisplayInput,
} from "@/shared/types/display.type";
import type { IDisplayRepository } from "../interfaces/display.interface";

export class DisplayRepository implements IDisplayRepository {
  async createDisplay(data: CreateDisplayInput): Promise<Display> {
    const result = await db.insert(display).values(data).returning();
    return result[0];
  }

  async getDisplay(id: string): Promise<Display | null> {
    const result = await db.select().from(display).where(eq(display.id, id));
    return result[0] ?? null;
  }

  async getDisplayBySlug(slug: string): Promise<Display | null> {
    const result = await db
      .select()
      .from(display)
      .where(eq(display.slug, slug));
    return result[0] ?? null;
  }

  async getAllDisplays(): Promise<Display[]> {
    return db.select().from(display).orderBy(display.createdAt);
  }

  async updateDisplay(id: string, data: UpdateDisplayInput): Promise<Display> {
    const result = await db
      .update(display)
      .set(data)
      .where(eq(display.id, id))
      .returning();
    return result[0];
  }

  async deleteDisplay(id: string): Promise<void> {
    await db.delete(display).where(eq(display.id, id));
  }

  async addServiceToDisplay(
    data: AddServiceToDisplayInput,
  ): Promise<{ id: string }> {
    const result = await db.insert(displayService).values(data).returning();
    return { id: result[0].id };
  }

  async getDisplayServices(displayId: string): Promise<DisplayServiceRecord[]> {
    return db
      .select({
        displayService: displayService,
        service: service,
      })
      .from(displayService)
      .innerJoin(service, eq(displayService.serviceId, service.id))
      .where(eq(displayService.displayId, displayId))
      .orderBy(displayService.order)
      .then((result) =>
        result.map(({ displayService, service }) => ({
          ...displayService,
          service: service,
        })),
      );
  }

  async removeServiceFromDisplay(
    displayId: string,
    serviceId: string,
  ): Promise<void> {
    await db
      .delete(displayService)
      .where(
        and(
          eq(displayService.displayId, displayId),
          eq(displayService.serviceId, serviceId),
        ),
      );
  }

  async reorderDisplayServices(
    data: ReorderDisplayServicesInput,
  ): Promise<void> {
    await db.transaction(async (tx) => {
      // 각 항목의 order를 업데이트
      for (const item of data.items) {
        await tx
          .update(displayService)
          .set({ order: item.order })
          .where(
            and(
              eq(displayService.displayId, data.displayId),
              eq(displayService.serviceId, item.serviceId),
            ),
          );
      }
    });
  }

  async getDisplayServiceByOrder(
    displayId: string,
    order: number,
  ): Promise<DisplayServiceRecord | null> {
    const [result] = await db
      .select({
        displayService: displayService,
        service: service,
      })
      .from(displayService)
      .innerJoin(service, eq(displayService.serviceId, service.id))
      .where(
        and(
          eq(displayService.displayId, displayId),
          eq(displayService.order, order),
        ),
      );
    if (!result) return null;

    return {
      ...result.displayService,
      service: result.service,
    };
  }

  async getDisplayWithServiceDetailsBySlug(
    slug: string,
  ): Promise<DisplayWithServiceDetails | null> {
    // 1. Display 조회
    const displayData = await this.getDisplayBySlug(slug);
    if (!displayData) return null;

    // 2. Display의 services 조회 (join table)
    const displayServices = await db
      .select({
        displayService: displayService,
        service: service,
      })
      .from(displayService)
      .innerJoin(service, eq(displayService.serviceId, service.id))
      .where(eq(displayService.displayId, displayData.id))
      .orderBy(displayService.order);

    // 3. 각 Service의 리뷰 통계 및 가격 정보 계산
    const serviceIds = displayServices.map((ds) => ds.service.id);

    if (serviceIds.length === 0) {
      return {
        ...displayData,
        services: [],
      };
    }

    // 리뷰 집계 쿼리
    const reviewStats = await db
      .select({
        serviceId: review.serviceId,
        reviewCount: sql<number>`count(*)::int`,
        rating: sql<number>`coalesce(avg(${review.rating})::numeric, 0)`,
      })
      .from(review)
      .where(inArray(review.serviceId, serviceIds))
      .groupBy(review.serviceId);

    // STANDARD 플랜 가격 조회
    const standardPlans = await db
      .select({
        serviceId: servicePlan.serviceId,
        price: servicePlan.price,
        salePrice: servicePlan.salePrice,
      })
      .from(servicePlan)
      .where(
        and(
          inArray(servicePlan.serviceId, serviceIds),
          eq(servicePlan.planType, "STANDARD"),
        ),
      );

    // ServiceId를 키로 하는 맵 생성
    const statsMap = new Map(
      reviewStats.map((stat) => {
        const rawRating = Number(stat.rating);
        // 소수점 1자리에서 반올림
        const roundedRating = Math.round(rawRating * 10) / 10;
        return [
          stat.serviceId,
          {
            reviewCount: stat.reviewCount,
            rating: roundedRating,
          },
        ];
      }),
    );

    const priceMap = new Map(
      standardPlans.map((plan) => [
        plan.serviceId,
        { price: plan.price, salePrice: plan.salePrice },
      ]),
    );

    // 4. Service 정보, 리뷰 통계, 가격 정보 결합
    const servicesWithStats: ServiceWithReviewStats[] = displayServices.map(
      ({ service: svc, displayService: ds }) => ({
        ...svc,
        reviewCount: statsMap.get(svc.id)?.reviewCount ?? 0,
        rating: statsMap.get(svc.id)?.rating ?? 0,
        price: priceMap.get(svc.id)?.price ?? 0,
        salePrice: priceMap.get(svc.id)?.salePrice ?? null,
        order: ds.order,
      }),
    );

    return {
      ...displayData,
      services: servicesWithStats,
    };
  }
}
