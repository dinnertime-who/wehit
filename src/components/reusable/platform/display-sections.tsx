"use client";

import { useDisplayBySlug } from "@/hooks/apis/displays/use-display-by-slug";
import { convertServiceToClassItem } from "@/utils/display";
import { ClassListSection } from "./class-list-section";

export function DisplaySection({ slug }: { slug: string }) {
  const { data: display } = useDisplayBySlug(slug);

  if (!display || !display.services || display.services.length === 0) {
    return null;
  }

  const classes = display.services.slice(0, 4).map(convertServiceToClassItem);

  return <ClassListSection title={display.title} classes={classes} />;
}
