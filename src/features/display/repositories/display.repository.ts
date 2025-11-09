import "server-only";

import { eq, and } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { display, displayService, service } from "@/infrastructure/db/schema";
import type {
  Display,
  DisplayServiceRecord,
  DisplayWithServices,
  CreateDisplayInput,
  UpdateDisplayInput,
  AddServiceToDisplayInput,
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

  async updateDisplay(
    id: string,
    data: UpdateDisplayInput,
  ): Promise<Display> {
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
  ): Promise<DisplayServiceRecord> {
    const result = await db
      .insert(displayService)
      .values(data)
      .returning();
    return result[0];
  }

  async getDisplayServices(displayId: string): Promise<DisplayServiceRecord[]> {
    return db
      .select()
      .from(displayService)
      .where(eq(displayService.displayId, displayId))
      .orderBy(displayService.order);
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

  async getDisplayServiceByOrder(
    displayId: string,
    order: number,
  ): Promise<DisplayServiceRecord | null> {
    const result = await db
      .select()
      .from(displayService)
      .where(
        and(
          eq(displayService.displayId, displayId),
          eq(displayService.order, order),
        ),
      );
    return result[0] ?? null;
  }
}
