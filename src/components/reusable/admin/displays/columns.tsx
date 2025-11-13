import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Display } from "@/shared/types/display.type";
import { DisplayRowActions } from "./display-row-actions";

export const columns: ColumnDef<Display>[] = [
  {
    accessorKey: "title",
    header: "디스플레이 제목",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="text-sm text-muted-foreground">{row.original.slug}</div>
        <div className="font-medium">{row.getValue("title")}</div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "생성일",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">
          {format(date, "yyyy-MM-dd", { locale: ko })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "작업",
    cell: ({ row }) => <DisplayRowActions display={row.original} />,
  },
];
