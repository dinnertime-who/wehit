import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { BannerIdProvider } from "@/components/reusable/admin/banners/detail/banner-id-provider";
import { BannerItemsSection } from "@/components/reusable/admin/banners/detail/banner-items-section";
import { BannerUpdateForm } from "@/components/reusable/admin/banners/detail/banner-metadata.form";
import { BannersPageHeader } from "@/components/reusable/admin/banners/detail/banners-page-header";
import { makeQueryClient } from "@/config/react-query/query-client";
import { bannerQueryOptions } from "@/hooks/apis/banners/use-banner";
import { tryCatch } from "@/lib/try-catch";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: PageProps<"/admin/banners/[id]">) {
  const { id } = await params;

  const queryClient = makeQueryClient();
  const { data: banner } = await tryCatch(
    async () => await queryClient.ensureQueryData(bannerQueryOptions(id)),
  );

  if (!banner) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BannerIdProvider bannerId={id}>
        <section>
          <BannersPageHeader />
          <BannerUpdateForm />
          <BannerItemsSection />
        </section>
      </BannerIdProvider>
    </HydrationBoundary>
  );
}
