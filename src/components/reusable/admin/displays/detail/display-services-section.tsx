"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDisplay } from "@/hooks/apis/displays/use-display";
import { useReorderDisplayServices } from "@/hooks/apis/displays/use-reorder-display-services";
import { DisplayServiceCard } from "./display-service-card";
import { ServiceSearchDialog } from "./service-search-dialog";

type Props = {
  displayId: string;
};

export const DisplayServicesSection = ({ displayId }: Props) => {
  const { data: display } = useDisplay(displayId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const reorderMutation = useReorderDisplayServices(displayId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (reorderMutation.isPending) return;

    if (!over || !display?.services) return;

    if (active.id === over.id) return;

    const sortedServices = [...display.services].sort(
      (a, b) => a.order - b.order,
    );
    const oldIndex = sortedServices.findIndex((s) => s.id === active.id);
    const newIndex = sortedServices.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // 새로운 순서로 배열 재정렬
    const [movedItem] = sortedServices.splice(oldIndex, 1);
    sortedServices.splice(newIndex, 0, movedItem);

    // 새로운 order 값으로 업데이트
    const items = sortedServices.map((service, index) => ({
      serviceId: service.serviceId,
      order: index,
    }));

    try {
      await reorderMutation.mutateAsync({ items });
      toast.success("순서가 변경되었습니다");
    } catch (error) {
      console.error("Failed to reorder services:", error);
      toast.error("순서 변경에 실패했습니다");
    }
  };

  if (!display) return null;

  const sortedServices = [...(display.services || [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>연결된 서비스</CardTitle>
              <CardDescription>
                디스플레이에 표시될 서비스를 관리합니다
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              서비스 추가
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {sortedServices.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedServices.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedServices.map((displayService) => (
                    <DisplayServiceCard
                      key={displayService.id}
                      displayService={displayService}
                      displayId={displayId}
                      isReordering={reorderMutation.isPending}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">연결된 서비스가 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceSearchDialog
        displayId={displayId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
