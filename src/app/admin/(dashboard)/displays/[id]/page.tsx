import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { DisplayMetadataForm } from "@/components/reusable/admin/displays/detail/display-metadata-form";
import { DisplayServicesSection } from "@/components/reusable/admin/displays/detail/display-services-section";
import { makeQueryClient } from "@/config/react-query/query-client";
import { displayQueryOptions } from "@/hooks/apis/displays/use-display";
import { tryCatch } from "@/lib/try-catch";

export const dynamic = "force-dynamic";

export default async function AdminDisplayDetailPage(
  props: PageProps<"/admin/displays/[id]">,
) {
  const { id } = await props.params;
  const queryClient = makeQueryClient();

  const { data: display, error } = await tryCatch(
    async () => await queryClient.ensureQueryData(displayQueryOptions(id)),
  );

  if (error || !display) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">디스플레이 수정</h1>
          <p className="text-sm text-muted-foreground mt-2">
            디스플레이 정보를 수정하고 서비스를 관리합니다
          </p>
        </div>
        <DisplayMetadataForm display={display} />
        <DisplayServicesSection displayId={id} />
      </section>
    </HydrationBoundary>
  );
}
