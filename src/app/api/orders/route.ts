import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { OrderService } from "@/features/order/services/order.service";
import { z } from "zod";
import type { CreateOrderDTO } from "@/shared/types/order.type";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      serviceId: z.string(),
      quantity: z.number().int().positive().optional().default(1),
      price: z.number().int().positive(),
      salePrice: z.number().int().positive().optional(),
    }),
  ).min(1),
  paymentMethod: z.string().optional().default("bank_transfer"),
  paymentInfo: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const orderData: CreateOrderDTO = {
      userId: session.user.id,
      items: validatedData.items,
      paymentMethod: validatedData.paymentMethod,
      paymentInfo: validatedData.paymentInfo,
    };

    const order = await OrderService.createOrder(orderData);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "주문 생성 실패" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 },
      );
    }

    const orders = await OrderService.getOrdersByUserId(session.user.id);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "주문 목록 조회 실패" },
      { status: 500 },
    );
  }
}

