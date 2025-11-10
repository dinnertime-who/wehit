"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useServices } from "@/hooks/apis/services/use-services";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (serviceId: string) => void;
};

export const ServiceLinkDialog = ({
  open,
  onOpenChange,
  onSelect,
}: Props) => {
  const { data: services } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const filteredServices = services?.data.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || [];

  const handleConfirm = () => {
    if (selectedServiceId) {
      onSelect(selectedServiceId);
      setSearchTerm("");
      setSelectedServiceId("");
    }
  };

  const handleCancel = () => {
    setSearchTerm("");
    setSelectedServiceId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>서비스 검색</DialogTitle>
          <DialogDescription>
            링크할 서비스를 검색하고 선택합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 서비스 검색 */}
          <div className="space-y-2">
            <label htmlFor="search-input" className="text-sm font-medium">
              서비스 검색
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="서비스명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            />
          </div>

          {/* 서비스 선택 */}
          <div className="space-y-2">
            <label htmlFor="service-select" className="text-sm font-medium">
              선택된 서비스
            </label>
            <select
              id="service-select"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="">-- 서비스 선택 --</option>
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedServiceId}
          >
            선택
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

