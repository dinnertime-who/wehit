import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "@/shared/types/banner.type";
import { BannerRowActions } from "./banner-row-actions";

export const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: "slug",
    header: () => <div className="font-semibold">배너 이름</div>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("slug")}</span>
    ),
  },
  {
    id: "ratio",
    header: () => <div className="font-semibold">비율</div>,
    cell: ({ row }) => {
      const banner = row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {banner.widthRatio} × {banner.heightRatio}
        </span>
      );
    },
  },
  {
    accessorKey: "displayDevice",
    header: () => <div className="font-semibold">노출 기기</div>,
    cell: ({ row }) => {
      const device = row.getValue("displayDevice") as string;
      const displayMap: Record<string, string> = {
        mobile: "모바일",
        desktop: "데스크톱",
        all: "전체",
      };
      const variantMap: Record<string, "default" | "secondary" | "outline"> = {
        all: "default",
        desktop: "outline",
        mobile: "secondary",
      };
      return (
        <Badge variant={variantMap[device] || "secondary"}>
          {displayMap[device] || device}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="font-semibold">생성일</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <span className="text-sm">
          {format(date, "yyyy-MM-dd", { locale: ko })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="font-semibold"></div>,
    cell: () => <BannerRowActions />,
  },
];
