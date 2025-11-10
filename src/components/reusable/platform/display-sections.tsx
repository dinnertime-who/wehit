"use client";

import { useDisplayBySlug } from "@/hooks/apis/displays/use-display-by-slug";
import {
  NEW_DISPLAY_SLUG,
  POPULAR_DISPLAY_SLUG,
  RECOMMENDED_DISPLAY_SLUG,
} from "@/shared/constants/display.constant";
import { convertServiceToClassItem } from "@/utils/display";
import { ClassListSection } from "./class-list-section";
import { MiddleBanner } from "./middle-banner";

export function DisplaySections() {
  return (
    <>
      <DisplaySection slug={RECOMMENDED_DISPLAY_SLUG} />
      <MiddleBanner />
      <DisplaySection slug={POPULAR_DISPLAY_SLUG} />
      <DisplaySection slug={NEW_DISPLAY_SLUG} />
    </>
  );
}

function DisplaySection({ slug }: { slug: string }) {
  const { data: display } = useDisplayBySlug(slug);

  if (!display || !display.services || display.services.length === 0) {
    return null;
  }

  const classes = display.services.slice(0, 4).map(convertServiceToClassItem);

  return <ClassListSection title={display.title} classes={classes} />;
}
