"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Service } from "@/shared/types/service.type";
import { ServiceRowActions } from "./service-row-actions";

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "카테고리",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "가격",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div className="text-sm">{price.toLocaleString()}원</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "생성일",
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
    cell: ({ row }) => <ServiceRowActions service={row.original} />,
  },
];
