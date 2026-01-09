"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useServices } from "@/hooks/apis/services/use-services";
import { cn } from "@/lib/utils";
import { columns } from "./columns";

export const ServicesDataTable = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data: services } = useServices(page, limit);

  console.log(services);

  const table = useReactTable({
    data: services?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/services/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            서비스 생성
          </Button>
        </Link>
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

        {/* Summary & Pagination */}
        <div className="flex items-center justify-between border shadow-sm rounded-b-lg bg-card px-6 py-4">
          <div className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            총 {services?.pagination.total || 0}개 서비스
          </div>

          {services && services.pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={cn(
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer",
                    )}
                  />
                </PaginationItem>

                {Array.from(
                  { length: services.pagination.totalPages },
                  (_, i) => i + 1,
                ).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNum === 1 ||
                    pageNum === services.pagination.totalPages ||
                    Math.abs(pageNum - page) <= 1;

                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setPage(pageNum)}
                        isActive={pageNum === page}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((p) =>
                        Math.min(services.pagination.totalPages, p + 1),
                      )
                    }
                    className={cn(
                      page === services.pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer",
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};
