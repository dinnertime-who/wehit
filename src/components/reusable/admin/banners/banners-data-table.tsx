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
import { useBanners } from "@/hooks/apis/banners/use-banners";
import { cn } from "@/lib/utils";
import { columns } from "./columns";

export const BannersDataTable = () => {
  const { data: banners } = useBanners();

  const table = useReactTable({
    data: banners || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border shadow-sm rounded-b-lg bg-card px-6 py-4">
        <div className="text-sm text-muted-foreground font-medium">
          총 {banners?.length || 0}개 배너
        </div>
      </div>
    </div>
  );
};
