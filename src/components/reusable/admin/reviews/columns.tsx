import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Star } from "lucide-react";
import type { Review } from "@/shared/types/review.type";
import { ReviewRowActions } from "./review-row-actions";

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "writerName",
    header: "작성자",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("writerName")}</div>
    ),
  },
  {
    accessorKey: "serviceId",
    header: "서비스 ID",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground font-mono">
        {row.getValue("serviceId")}
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: "평점",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "content",
    header: "내용",
    cell: ({ row }) => {
      const content = row.getValue("content") as string;
      return (
        <div className="text-sm max-w-md line-clamp-2">{content}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "작성일",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">
          {format(new Date(date), "yyyy-MM-dd", { locale: ko })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "작업",
    cell: ({ row }) => <ReviewRowActions review={row.original} />,
  },
];

