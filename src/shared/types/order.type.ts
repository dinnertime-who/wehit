import type { order, orderItem } from "@/infrastructure/db/schema";

export type Order = typeof order.$inferSelect;
export type OrderItem = typeof orderItem.$inferSelect;

export type OrderWithItems = Order & {
  items: OrderItemWithService[];
};

export type OrderItemWithService = OrderItem & {
  service: {
    id: string;
    title: string;
    coverImageUrl: string;
  };
};

export type CreateOrderDTO = {
  userId: string;
  items: {
    serviceId: string;
    quantity?: number;
    price: number;
    salePrice?: number;
  }[];
  paymentMethod?: string;
  paymentInfo?: Record<string, unknown>;
};

export type UpdateOrderDTO = {
  status?: "pending" | "paid" | "cancelled" | "completed";
  paymentInfo?: Record<string, unknown>;
};

