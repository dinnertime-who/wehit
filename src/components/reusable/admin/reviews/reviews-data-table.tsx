"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAdminReviews } from "@/hooks/apis/admin/use-admin-reviews";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { ReviewCreateDialog } from "./review-create-dialog";

export const ReviewsDataTable = () => {
  const { data: reviews } = useAdminReviews();

  const table = useReactTable({
    data: reviews || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">리뷰 관리</h2>
        <ReviewCreateDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            리뷰 생성
          </Button>
        </ReviewCreateDialog>
      </div>
      <div className="space-y-0">
        <div className="rounded-t-lg border border-b-0 shadow-sm bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "bg-neutral-50 font-bold p-4",
                      header.id === "actions" ? "text-right" : "",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "px-4",
                      cell.column.id === "actions" ? "text-right" : "",
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

        {/* Summary */}
        <div className="flex items-center justify-between border shadow-sm rounded-b-lg bg-card px-6 py-4">
          <div className="text-sm text-muted-foreground font-medium">
            총 {reviews?.length || 0}개의 리뷰
          </div>
        </div>
      </div>
    </div>
  );
};

