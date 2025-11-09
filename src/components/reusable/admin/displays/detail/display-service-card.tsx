"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRemoveDisplayService } from "@/hooks/apis/displays/use-remove-display-service";
import { toast } from "sonner";
import type { DisplayServiceRecord } from "@/shared/types/display.type";

type Props = {
  displayService: DisplayServiceRecord;
  displayId: string;
};

export const DisplayServiceCard = ({ displayService, displayId }: Props) => {
  const removeMutation = useRemoveDisplayService(displayId);

  const handleRemove = async () => {
    try {
      await removeMutation.mutateAsync({
        serviceId: displayService.serviceId,
      });
      toast.success("서비스가 제거되었습니다");
    } catch (error) {
      console.error("Failed to remove service:", error);
      toast.error("서비스 제거에 실패했습니다");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            순서: {displayService.order}
          </div>
          <div className="text-sm text-muted-foreground">
            서비스 ID: {displayService.serviceId}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={removeMutation.isPending}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
