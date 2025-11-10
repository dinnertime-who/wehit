import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { kyClient } from "@/lib/fetch/client";
import type { CreateOrderDTO, Order } from "@/shared/types/order.type";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<CreateOrderDTO, "userId">) => {
      return kyClient.post("orders", { json: data }).json<Order>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("주문이 생성되었습니다");
    },
    onError: async (error) => {
      console.error("Order creation error:", error);
      let errorMessage = "주문 생성에 실패했습니다";
      if (error instanceof Error && "response" in error) {
        try {
          const errorData = await (
            error as { response: { json: () => Promise<{ error: string }> } }
          ).response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // JSON 파싱 실패 시 기본 메시지 사용
        }
      }
      toast.error(errorMessage);
    },
  });
};
