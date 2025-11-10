"use client";

import {
  Code,
  Palette,
  TrendingUp,
  Briefcase,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type Category = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const categories: Category[] = [
  {
    label: "프로그래밍",
    value: "programming",
    icon: Code,
  },
  {
    label: "디자인",
    value: "design",
    icon: Palette,
  },
  {
    label: "마케팅",
    value: "marketing",
    icon: TrendingUp,
  },
  {
    label: "비즈니스",
    value: "business",
    icon: Briefcase,
  },
  {
    label: "기타",
    value: "etc",
    icon: MoreHorizontal,
  },
];

export function CategorySection() {
  return (
    <section className="py-6 lg:py-12 bg-background">
      <div className="app-container px-4">
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.value}
                href={`/service?category=${category.value}`}
                className="group flex flex-col items-center justify-center"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-2 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300">
                  <Icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-primary transition-colors">
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
