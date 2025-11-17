"use client";

import Image from "next/image";
import Link from "next/link";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { CATEGORY_BANNER_SLUG } from "@/shared/constants/banner.constant";

export function CategorySection() {
  const { data: banner } = useBannerBySlug(CATEGORY_BANNER_SLUG);

  if (!banner || !banner.items || banner.items.length === 0) {
    return null;
  }

  return (
    <section className="my-20 bg-background">
      <div className="app-container px-4">
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {banner.items.map((item) => (
            <Link
              key={item.id}
              href={
                (item.linkUrl || "/") as React.ComponentProps<
                  typeof Link
                >["href"]
              }
              className="group flex flex-col items-center justify-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-2 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name || "카테고리"}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                {item.name || "카테고리"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
