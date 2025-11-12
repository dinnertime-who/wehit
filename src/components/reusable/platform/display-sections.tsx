"use client";

import { useDisplayBySlug } from "@/hooks/apis/displays/use-display-by-slug";
import { convertServiceToClassItem } from "@/utils/display";
import { ClassListSection } from "./class-list-section";

export function DisplaySection({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { data: display } = useDisplayBySlug(slug);

  if (!display || !display.services || display.services.length === 0) {
    return null;
  }

  const classes = display.services.map(convertServiceToClassItem);

  return (
    <ClassListSection
      title={display.title}
      classes={classes}
      className={className}
    />
  );
}
