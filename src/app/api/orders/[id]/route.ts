import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { OrderService } from "@/features/order/services/order.service";
import { z } from "zod";

const updateOrderSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled", "completed"]).optional(),
  paymentInfo: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: _request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const order = await OrderService.getOrderWithItems(id);

    if (!order) {
      return NextResponse.json(
        { error: "주문을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // 본인의 주문만 조회 가능
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 },
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "주문 조회 실패" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
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

    const { id } = await context.params;
    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const order = await OrderService.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: "주문을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // 본인의 주문만 수정 가능
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 },
      );
    }

    const updatedOrder = await OrderService.updateOrder(id, validatedData);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "주문 업데이트 실패" },
      { status: 500 },
    );
  }
}

