import "server-only";

import { eq, desc } from "drizzle-orm";
import { db } from "@/infrastructure/db/drizzle";
import { order, orderItem, service } from "@/infrastructure/db/schema";
import type {
  CreateOrderDTO,
  UpdateOrderDTO,
  Order,
  OrderWithItems,
  OrderItemWithService,
} from "@/shared/types/order.type";

export class OrderRepository {
  /**
   * 고유 주문번호 생성 (YYYYMMDDHHmmss + 랜덤 6자리)
   */
  private static generateOrderNumber(): string {
    const now = new Date();
    const dateStr = now
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14); // YYYYMMDDHHmmss
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${dateStr}-${randomStr}`;
  }

  static async create(data: CreateOrderDTO): Promise<Order> {
    // 총 금액 계산
    const totalAmount = data.items.reduce((sum, item) => {
      const price = item.salePrice || item.price;
      return sum + price * (item.quantity || 1);
    }, 0);

    // 주문 생성
    const [newOrder] = await db
      .insert(order)
      .values({
        userId: data.userId,
        orderNumber: this.generateOrderNumber(),
        totalAmount,
        status: "pending",
        paymentMethod: data.paymentMethod || "bank_transfer",
        paymentInfo: data.paymentInfo || null,
      })
      .returning();

    // 주문 항목 생성
    await db.insert(orderItem).values(
      data.items.map((item) => ({
        orderId: newOrder.id,
        serviceId: item.serviceId,
        quantity: item.quantity || 1,
        price: item.price,
        salePrice: item.salePrice || null,
      })),
    );

    return newOrder;
  }

  static async getById(id: string): Promise<Order | null> {
    const result = await db.query.order.findFirst({
      where: eq(order.id, id),
    });
    return result as Order | null;
  }

  static async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    const result = await db.query.order.findFirst({
      where: eq(order.orderNumber, orderNumber),
    });
    return result as Order | null;
  }

  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    const results = await db.query.order.findMany({
      where: eq(order.userId, userId),
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    });
    return results as Order[];
  }

  static async getOrderWithItems(id: string): Promise<OrderWithItems | null> {
    const orderData = await this.getById(id);
    if (!orderData) return null;

    const items = await db.query.orderItem.findMany({
      where: eq(orderItem.orderId, id),
      with: {
        service: {
          columns: {
            id: true,
            title: true,
            coverImageUrl: true,
          },
        },
      },
    });

    return {
      ...orderData,
      items: items as OrderItemWithService[],
    };
  }

  static async update(
    id: string,
    data: UpdateOrderDTO,
  ): Promise<Order | null> {
    const [result] = await db
      .update(order)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(order.id, id))
      .returning();
    return result as Order | null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(order).where(eq(order.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

