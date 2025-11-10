"use client";

import { Search, X } from "lucide-react";
import type Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ClassCard } from "@/components/reusable/platform/class-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServicesWithStats } from "@/hooks/apis/services/use-services-with-stats";
import { convertServiceToClassItem } from "@/utils/display";

const CATEGORY_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "프로그래밍", value: "programming" },
  { label: "디자인", value: "design" },
  { label: "마케팅", value: "marketing" },
  { label: "비즈니스", value: "business" },
  { label: "기타", value: "etc" },
];

export function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  const { data } = useServicesWithStats({
    page,
    limit: 12,
    category: category || undefined,
    search: search || undefined,
  });

  const services = data.data;
  const pagination = data.pagination;
  const classes = services.map(convertServiceToClassItem);

  const updateParams = (updates: Record<string, string | null>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // 페이지 변경이 아닌 경우 첫 페이지로 리셋
      if (!updates.page) {
        params.delete("page");
      }
      router.push(`/service?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: null });
  };

  const handleCategoryChange = (value: string) => {
    updateParams({ category: value || null, page: null });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">전체 강의</h1>
        <p className="text-muted-foreground">
          모든 강의를 확인하고 원하는 강의를 찾아보세요
        </p>
      </div>

      {/* 필터 섹션 */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="강의 제목으로 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-9"
                disabled={isPending}
              />
              {searchInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => {
                    setSearchInput("");
                    updateParams({ search: null, page: null });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {/* 카테고리 필터 */}
          <Select
            value={category}
            onValueChange={handleCategoryChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 결과 요약 */}
        {(category || search) && (
          <div className="text-sm text-muted-foreground">
            총 {pagination.total}개의 강의를 찾았습니다
          </div>
        )}
      </div>

      {/* 강의 목록 */}
      {isPending ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">등록된 강의가 없습니다</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
            {classes.map((classItem) => (
              <ClassCard
                key={classItem.id}
                href={
                  `/service/${classItem.id}` as React.ComponentProps<
                    typeof Link
                  >["href"]
                }
                category={classItem.category}
                title={classItem.title}
                tutor={classItem.tutor}
                discountRate={classItem.discountRate}
                originalPrice={classItem.originalPrice}
                salePrice={classItem.salePrice}
                reviewCount={classItem.reviewCount}
                reviewRating={classItem.rating}
                thumbnailUrl={classItem.thumbnail}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) {
                        handlePageChange(page - 1);
                      }
                    }}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {(() => {
                  const pages: (number | "ellipsis")[] = [];
                  const totalPages = pagination.totalPages;

                  if (totalPages <= 7) {
                    // 7페이지 이하면 모두 표시
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // 첫 페이지
                    pages.push(1);

                    if (page <= 4) {
                      // 현재 페이지가 앞쪽에 있으면
                      for (let i = 2; i <= 5; i++) {
                        pages.push(i);
                      }
                      pages.push("ellipsis");
                      pages.push(totalPages);
                    } else if (page >= totalPages - 3) {
                      // 현재 페이지가 뒤쪽에 있으면
                      pages.push("ellipsis");
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // 현재 페이지가 중간에 있으면
                      pages.push("ellipsis");
                      for (let i = page - 1; i <= page + 1; i++) {
                        pages.push(i);
                      }
                      pages.push("ellipsis");
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((p) => {
                    if (p === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${p}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(p);
                          }}
                          isActive={p === page}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  });
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < pagination.totalPages) {
                        handlePageChange(page + 1);
                      }
                    }}
                    className={
                      page >= pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
