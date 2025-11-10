import { integer, pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "./_core";
import { user } from "./auth.schema";
import { service } from "./service.schema";

export const order = pgTable("order", {
  id: cuidPrimaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(), // 고유 주문번호
  totalAmount: integer("total_amount").notNull(), // 총 금액
  status: text("status")
    .notNull()
    .default("pending"), // pending, paid, cancelled, completed
  paymentMethod: text("payment_method").notNull().default("bank_transfer"), // 결제 방식
  paymentInfo: jsonb("payment_info"), // 결제 정보 (JSON)
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const orderItem = pgTable("order_item", {
  id: cuidPrimaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  serviceId: text("service_id")
    .notNull()
    .references(() => service.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1), // 수량
  price: integer("price").notNull(), // 주문 시점 가격
  salePrice: integer("sale_price"), // 주문 시점 할인가
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

