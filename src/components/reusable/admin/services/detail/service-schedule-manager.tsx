"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ScheduleFormDialog } from "./schedule-form-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useServiceSchedules,
  useDeleteServiceSchedule,
} from "@/hooks/apis/use-service-schedules";
import type { ServiceSchedule } from "@/shared/types/service.type";
import { Calendar, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  serviceId: string;
};

export const ServiceScheduleManager = ({ serviceId }: Props) => {
  const { data: schedules, isLoading, error } = useServiceSchedules(serviceId);
  const deleteMutation = useDeleteServiceSchedule();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<
    ServiceSchedule | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<
    ServiceSchedule | undefined
  >();

  const handleAddSchedule = () => {
    setEditingSchedule(undefined);
    setDialogOpen(true);
  };

  const handleEditSchedule = (schedule: ServiceSchedule) => {
    setEditingSchedule(schedule);
    setDialogOpen(true);
  };

  const handleDeleteClick = (schedule: ServiceSchedule) => {
    setDeletingSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSchedule) return;

    try {
      await deleteMutation.mutateAsync({
        serviceId,
        scheduleId: deletingSchedule.id,
      });
      toast.success("스케줄이 삭제되었습니다");
      setDeleteDialogOpen(false);
      setDeletingSchedule(undefined);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "스케줄 삭제 실패";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>스케줄 관리</CardTitle>
          <CardDescription>클래스 스케줄을 추가하고 관리합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>스케줄 관리</CardTitle>
          <CardDescription>클래스 스케줄을 추가하고 관리합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">
            스케줄 정보를 불러오는데 실패했습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>스케줄 관리</CardTitle>
          <CardDescription>
            클래스 스케줄을 추가하고 관리합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules && schedules.length > 0 ? (
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {schedule.scheduleType === "flexible"
                              ? "유연한 일정"
                              : "고정된 일정"}
                          </span>
                        </div>
                        
                        {schedule.scheduleDescription && (
                          <p className="text-sm text-muted-foreground pl-6">
                            {schedule.scheduleDescription}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 pl-6">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {schedule.location}
                            {schedule.locationDetail && (
                              <span className="text-muted-foreground">
                                {" "}
                                · {schedule.locationDetail}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(schedule)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                등록된 스케줄이 없습니다
              </div>
            )}
            
            <Button onClick={handleAddSchedule} className="w-full">
              + 스케줄 추가
            </Button>
          </div>
        </CardContent>
      </Card>

      <ScheduleFormDialog
        serviceId={serviceId}
        schedule={editingSchedule}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>스케줄 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 스케줄을 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
