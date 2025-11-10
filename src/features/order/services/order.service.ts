import "server-only";

import { OrderRepository } from "../repositories/order.repository";
import type {
  CreateOrderDTO,
  UpdateOrderDTO,
  Order,
  OrderWithItems,
} from "@/shared/types/order.type";

export class OrderService {
  static async createOrder(data: CreateOrderDTO): Promise<Order> {
    // TODO: 서비스 존재 여부 검증
    // TODO: 재고 확인 (필요시)
    return OrderRepository.create(data);
  }

  static async getOrderById(id: string): Promise<Order | null> {
    return OrderRepository.getById(id);
  }

  static async getOrderByOrderNumber(
    orderNumber: string,
  ): Promise<Order | null> {
    return OrderRepository.getByOrderNumber(orderNumber);
  }

  static async getOrdersByUserId(userId: string): Promise<Order[]> {
    return OrderRepository.getOrdersByUserId(userId);
  }

  static async getOrderWithItems(id: string): Promise<OrderWithItems | null> {
    return OrderRepository.getOrderWithItems(id);
  }

  static async updateOrder(
    id: string,
    data: UpdateOrderDTO,
  ): Promise<Order | null> {
    // TODO: 상태 변경 권한 검증
    return OrderRepository.update(id, data);
  }

  static async deleteOrder(id: string): Promise<boolean> {
    return OrderRepository.delete(id);
  }
}

