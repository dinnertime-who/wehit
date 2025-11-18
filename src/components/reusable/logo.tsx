import Image from "next/image";
import Link from "next/link";
import { useBannerBySlug } from "@/hooks/apis/banners/use-banner-by-slug";
import { cn } from "@/lib/utils";
import { LOGO_BANNER_SLUG } from "@/shared/constants/banner.constant";
import { Skeleton } from "../ui/skeleton";

type Props = {
  className?: string;
};

export const Logo = ({ className }: Props) => {
  const { data: banner, isLoading } = useBannerBySlug(LOGO_BANNER_SLUG);
  const logoSrc = banner?.items[0]?.imageUrl;

  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      {isLoading ? (
        <Skeleton className="w-10 h-10" />
      ) : (
        <Image
          src={logoSrc || "/logo.png"}
          alt="WiHit Logo"
          width={banner?.widthRatio}
          height={banner?.heightRatio}
        />
      )}
    </Link>
  );
};
