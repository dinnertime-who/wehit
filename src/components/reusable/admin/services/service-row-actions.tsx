"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useDeleteService } from "@/hooks/apis/services/use-delete-service";
import { useDialogService } from "@/hooks/stores/use-dialog-service";
import type { Service } from "@/shared/types/service.type";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

type Props = {
  service: Service;
};

export const ServiceRowActions = ({ service }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogService = useDialogService();
  const deleteMutation = useDeleteService(service.id);

  const handleDelete = async () => {
    const confirmed = await dialogService.confirm(
      "정말 이 서비스를 삭제하시겠습니까?",
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync();
      toast.success("서비스가 삭제되었습니다");
      setIsOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다",
      );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40">
        <div className="flex flex-col gap-2">
          <Link href={`/admin/services/${service.id}`}>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <Edit className="w-4 h-4" />
              수정
            </Button>
          </Link>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full justify-start gap-2 text-red-600 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
