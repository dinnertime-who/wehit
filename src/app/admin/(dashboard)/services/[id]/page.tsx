import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/reusable/admin/services/detail/service-form";
import { ServiceIdProvider } from "@/components/reusable/admin/services/detail/service-id-provider";
import { makeQueryClient } from "@/config/react-query/query-client";
import { serviceQueryOptions } from "@/hooks/apis/services/use-service";
import { tryCatch } from "@/lib/try-catch";

export const dynamic = "force-dynamic";

export default async function AdminServiceDetailPage(
  props: PageProps<"/admin/services/[id]">,
) {
  const { id } = await props.params;
  const queryClient = makeQueryClient();

  const { data: service, error } = await tryCatch(
    async () => await queryClient.ensureQueryData(serviceQueryOptions(id)),
  );

  if (error || !service) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ServiceIdProvider serviceId={id}>
        <section className="space-y-8">
          <ServiceForm mode="edit" service={service} />
        </section>
      </ServiceIdProvider>
    </HydrationBoundary>
  );
}
