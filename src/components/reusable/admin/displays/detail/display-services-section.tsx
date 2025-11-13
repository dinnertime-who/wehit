"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDisplay } from "@/hooks/apis/displays/use-display";
import { DisplayServiceCard } from "./display-service-card";
import { ServiceSearchDialog } from "./service-search-dialog";

type Props = {
  displayId: string;
};

export const DisplayServicesSection = ({ displayId }: Props) => {
  const { data: display } = useDisplay(displayId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!display) return null;

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
          {display.services && display.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {display.services
                .sort((a, b) => a.order - b.order)
                .map((displayService) => (
                  <DisplayServiceCard
                    key={displayService.id}
                    displayService={displayService}
                    displayId={displayId}
                  />
                ))}
            </div>
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
