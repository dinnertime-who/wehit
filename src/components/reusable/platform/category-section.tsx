"use client";

import {
  BookOpenText,
  BotIcon,
  Briefcase,
  Camera,
  Code,
  type LucideIcon,
  NotebookPen,
  Palette,
  Pen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

type Category = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const categories: Category[] = [
  {
    label: "디자인",
    value: "design",
    icon: Palette,
  },
  {
    label: "IT·프로그래밍",
    value: "programming",
    icon: Code,
  },
  {
    label: "영상·사진·음악",
    value: "media",
    icon: Camera,
  },
  {
    label: "마케팅",
    value: "marketing",
    icon: TrendingUp,
  },
  {
    label: "문서·글쓰기",
    value: "writing",
    icon: Pen,
  },
  {
    label: "창업·사업",
    value: "business",
    icon: Briefcase,
  },
  {
    label: "세무·법무·노무",
    value: "accounting",
    icon: NotebookPen,
  },
  {
    label: "전자책",
    value: "ebook",
    icon: BookOpenText,
  },
  {
    label: "AI서비스",
    value: "ai",
    icon: BotIcon,
  },
];

export function CategorySection() {
  return (
    <section className="my-20 bg-background">
      <div className="app-container px-4">
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.value}
                href={
                  `/service?category=${category.value}` as React.ComponentProps<
                    typeof Link
                  >["href"]
                }
                className="group flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-2 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300">
                  <Icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
