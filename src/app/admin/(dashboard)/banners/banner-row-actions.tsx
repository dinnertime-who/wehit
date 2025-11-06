"use client";

import { Edit, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const BannerRowActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2" align="end">
        <Link href="#">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
};
